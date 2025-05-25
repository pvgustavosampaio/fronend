// Follow Deno edge function patterns
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

// Define CORS headers directly in the function since shared module is not accessible
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ChurnFeatures {
  attendanceFrequency: number;
  daysSinceLastAttendance: number;
  hasLatePayment: boolean;
  paymentDelayDays: number;
  averageRating: number;
  age: number;
  gender: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userId, batchProcess } = await req.json();
    
    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (batchProcess) {
      // Process all users
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id");
      
      if (usersError) throw usersError;
      
      const results = [];
      for (const user of users || []) {
        try {
          const prediction = await predictUserChurn(supabase, user.id);
          results.push(prediction);
        } catch (error) {
          console.error(`Error processing user ${user.id}:`, error);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: results.length,
          total: users?.length || 0
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else if (userId) {
      // Process single user
      const prediction = await predictUserChurn(supabase, userId);
      
      return new Response(
        JSON.stringify({ success: true, prediction }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      throw new Error("Missing userId or batchProcess parameter");
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function predictUserChurn(supabase, userId: string) {
  // Fetch user data
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (userError) throw userError;
  if (!user) throw new Error("User not found");

  // Fetch attendance data
  const { data: attendanceData, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(30);
  
  if (attendanceError) throw attendanceError;

  // Fetch payment data
  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: false })
    .limit(6);
  
  if (paymentError) throw paymentError;

  // Fetch feedback data
  const { data: feedbackData, error: feedbackError } = await supabase
    .from("feedback")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(5);
  
  if (feedbackError) throw feedbackError;

  // Calculate features
  const features = calculateFeatures(user, attendanceData, paymentData, feedbackData);
  
  // Calculate churn probability using the features
  const { probability, confidence, factors } = calculateProbability(features);
  
  // Determine risk level
  const riskLevel = getRiskLevel(probability);
  
  // Save prediction to database
  const { data: prediction, error: predictionError } = await supabase
    .from("churn_predictions")
    .insert({
      user_id: userId,
      churn_probability: probability,
      confidence_score: confidence,
      risk_level: riskLevel,
      factors: factors
    })
    .select()
    .single();
  
  if (predictionError) throw predictionError;
  
  return prediction;
}

function calculateFeatures(
  user: any, 
  attendanceData: any[], 
  paymentData: any[],
  feedbackData: any[]
): ChurnFeatures {
  // Calculate attendance features
  const attendanceCount = attendanceData.length;
  const lastAttendanceDate = attendanceData[0]?.date ? new Date(attendanceData[0].date) : null;
  const daysSinceLastAttendance = lastAttendanceDate 
    ? Math.floor((new Date().getTime() - lastAttendanceDate.getTime()) / (1000 * 60 * 60 * 24)) 
    : 30;
  
  // Calculate attendance frequency (last 30 days)
  const attendanceFrequency = attendanceCount / 30;
  
  // Calculate payment features
  const hasLatePayment = paymentData.some(p => 
    p.status === "atrasado" || 
    (p.status === "pendente" && new Date(p.due_date) < new Date())
  );
  const paymentDelayDays = hasLatePayment 
    ? Math.max(...paymentData
        .filter(p => p.status === "atrasado")
        .map(p => Math.floor((new Date().getTime() - new Date(p.due_date).getTime()) / (1000 * 60 * 60 * 24)))
      )
    : 0;
  
  // Calculate feedback features
  const averageRating = feedbackData.length > 0
    ? feedbackData.reduce((sum, item) => sum + (item.rating || 0), 0) / feedbackData.length
    : 3; // Default neutral rating
  
  // Calculate demographic features
  const age = user.age || 30; // Default age if missing
  
  return {
    attendanceFrequency,
    daysSinceLastAttendance,
    hasLatePayment,
    paymentDelayDays,
    averageRating,
    age,
    gender: user.gender || "unknown"
  };
}

function calculateProbability(features: ChurnFeatures) {
  // These weights would normally come from a trained model
  const weights = {
    attendanceFrequency: -0.4,      // Higher frequency -> lower churn
    daysSinceLastAttendance: 0.03,  // More days since last visit -> higher churn
    hasLatePayment: 0.2,            // Late payment -> higher churn
    paymentDelayDays: 0.01,         // More days late -> higher churn
    averageRating: -0.15,           // Higher rating -> lower churn
    baseRate: 0.15                  // Base churn rate
  };
  
  // Calculate logit (log-odds)
  let logit = weights.baseRate;
  logit += features.attendanceFrequency * weights.attendanceFrequency;
  logit += features.daysSinceLastAttendance * weights.daysSinceLastAttendance;
  logit += (features.hasLatePayment ? 1 : 0) * weights.hasLatePayment;
  logit += features.paymentDelayDays * weights.paymentDelayDays;
  logit += (5 - features.averageRating) * Math.abs(weights.averageRating); // Invert rating scale
  
  // Convert logit to probability using sigmoid function
  const probability = 1 / (1 + Math.exp(-logit));
  
  // Calculate confidence (simplified)
  const confidence = 0.7 + (Math.random() * 0.2); // Between 0.7 and 0.9
  
  // Determine key factors
  const factors = [];
  
  if (features.daysSinceLastAttendance > 14) {
    factors.push({
      type: "attendance",
      description: `${features.daysSinceLastAttendance} dias sem frequentar`,
      impact: "alto"
    });
  }
  
  if (features.hasLatePayment) {
    factors.push({
      type: "payment",
      description: `Pagamento atrasado há ${features.paymentDelayDays} dias`,
      impact: "alto"
    });
  }
  
  if (features.averageRating < 3) {
    factors.push({
      type: "feedback",
      description: `Avaliação média baixa: ${features.averageRating.toFixed(1)}/5`,
      impact: "médio"
    });
  }
  
  if (features.attendanceFrequency < 0.2) { // Less than 6 days per month
    factors.push({
      type: "attendance",
      description: `Baixa frequência: ${Math.round(features.attendanceFrequency * 30)} dias/mês`,
      impact: "médio"
    });
  }
  
  return {
    probability,
    confidence,
    factors
  };
}

function getRiskLevel(probability: number): string {
  if (probability < 0.3) return "baixo";
  if (probability < 0.7) return "médio";
  return "alto";
}