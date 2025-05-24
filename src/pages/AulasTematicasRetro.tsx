
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, Calendar, Users, BookOpen, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for retro classes
const retroClasses = [
  {
    id: 1,
    title: 'Aeróbica anos 80',
    description: 'Reviva a energia dos anos 80 com movimentos clássicos de alto impacto.',
    instructor: 'Maria Silva',
    duration: '45 min',
    level: 'Intermediário',
    participants: 18,
    likes: 24,
    videoUrl: 'https://www.youtube.com/embed/L_W3jNk11qQ',
    thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
    playlist: ['Physical - Olivia Newton-John', 'Eye of the Tiger - Survivor', 'Fame - Irene Cara']
  },
  {
    id: 2,
    title: 'Step anos 90',
    description: 'Treinamento com step ao ritmo das melhores músicas dos anos 90.',
    instructor: 'João Carlos',
    duration: '50 min',
    level: 'Avançado',
    participants: 12,
    likes: 32,
    videoUrl: 'https://www.youtube.com/embed/xqjZOzVkOqY',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    playlist: ['Rhythm is a Dancer - Snap!', 'What is Love - Haddaway', 'Genie in a Bottle - Christina Aguilera']
  },
  {
    id: 3,
    title: 'Cardio Funk',
    description: 'Mix de funk e cardio para queimar calorias com muito ritmo e diversão.',
    instructor: 'Ana Paula',
    duration: '40 min',
    level: 'Iniciante',
    participants: 24,
    likes: 36,
    videoUrl: 'https://www.youtube.com/embed/ZMO_XC9w7Lw',
    thumbnail: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408',
    playlist: ['Get Up (I Feel Like Being a) Sex Machine - James Brown', 'Play That Funky Music - Wild Cherry', 'Superstition - Stevie Wonder']
  },
  {
    id: 4,
    title: 'Jazzercise',
    description: 'Combinação clássica de jazz dance e exercícios aeróbicos dos anos 70.',
    instructor: 'Roberto Mendes',
    duration: '55 min',
    level: 'Intermediário',
    participants: 15,
    likes: 28,
    videoUrl: 'https://www.youtube.com/embed/vdX_OBUeHb4',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    playlist: ['Dancing Queen - ABBA', 'Y.M.C.A. - Village People', 'Stayin\' Alive - Bee Gees']
  }
];

const AulasTematicasRetro = () => {
  const [selectedClass, setSelectedClass] = useState(retroClasses[0]);
  const [activeTab, setActiveTab] = useState('todos');
  const isMobile = useIsMobile();
  
  const filterClasses = (tab: string) => {
    if (tab === 'todos') return retroClasses;
    if (tab === 'aerobica') return retroClasses.filter(c => c.title.toLowerCase().includes('aeróbica'));
    if (tab === 'step') return retroClasses.filter(c => c.title.toLowerCase().includes('step'));
    if (tab === 'funk') return retroClasses.filter(c => c.title.toLowerCase().includes('funk'));
    return retroClasses;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const filtered = filterClasses(value);
    if (filtered.length > 0) {
      setSelectedClass(filtered[0]);
    }
  };

  return (
    <MainLayout 
      pageTitle="Treinos e Aulas Temáticas Retrô"
      pageSubtitle="Reviva os exercícios clássicos que marcaram época"
      headerImage="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80"
    >
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Video player section */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe 
                src={selectedClass.videoUrl}
                className="absolute inset-0 w-full h-full" 
                title={selectedClass.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedClass.title}</h2>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Heart className="h-5 w-5 text-academy-pink" />
                  <span>{selectedClass.likes}</span>
                </Button>
              </div>
              
              <p className="text-muted-foreground">{selectedClass.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedClass.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedClass.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedClass.level}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-semibold mb-2">Playlist</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedClass.playlist.map((song, index) => (
                    <li key={index} className="text-sm">{song}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Class selection sidebar */}
          <div className="w-full md:w-1/3">
            <Tabs defaultValue="todos" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className="w-full">
                <TabsTrigger value="todos" className="flex-1">Todos</TabsTrigger>
                <TabsTrigger value="aerobica" className="flex-1">Aeróbica</TabsTrigger>
                <TabsTrigger value="step" className="flex-1">Step</TabsTrigger>
                <TabsTrigger value="funk" className="flex-1">Funk</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="m-0 space-y-3 max-h-[600px] overflow-y-auto">
                {filterClasses(activeTab).map((classItem) => (
                  <div 
                    key={classItem.id} 
                    className={`flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${selectedClass.id === classItem.id ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedClass(classItem)}
                  >
                    <div className="w-24 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      <img 
                        src={`${classItem.thumbnail}?w=200&h=120&fit=crop`} 
                        alt={classItem.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{classItem.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {classItem.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {classItem.participants}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="icon" className="flex-shrink-0 h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {filterClasses(activeTab).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma aula encontrada nesta categoria
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Adicione suas Aulas Temáticas</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Como gestora, você pode adicionar suas próprias aulas temáticas à plataforma.
              </p>
              <Button className="w-full">
                Adicionar Nova Aula
              </Button>
            </div>
          </div>
        </div>
        
        {/* Schedule and Availability Section */}
        <div className="border-t pt-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Programação e Disponibilidade</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-academy-purple" />
                <h3 className="font-medium">Próximas Aulas</h3>
              </div>
              <ul className="space-y-2">
                <li className="text-sm">
                  <span className="font-medium">Segunda-feira, 18:00</span> - Aeróbica anos 80
                </li>
                <li className="text-sm">
                  <span className="font-medium">Quarta-feira, 19:30</span> - Step anos 90
                </li>
                <li className="text-sm">
                  <span className="font-medium">Sexta-feira, 18:30</span> - Cardio Funk
                </li>
              </ul>
              <Button variant="ghost" size="sm" className="mt-3 w-full">
                Gerenciar Agenda
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-academy-blue" />
                <h3 className="font-medium">Estatísticas de Participação</h3>
              </div>
              <ul className="space-y-2">
                <li className="text-sm flex justify-between">
                  <span>Aeróbica anos 80</span>
                  <span className="font-medium">18 alunos</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Step anos 90</span>
                  <span className="font-medium">12 alunos</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Cardio Funk</span>
                  <span className="font-medium">24 alunos</span>
                </li>
              </ul>
              <Button variant="ghost" size="sm" className="mt-3 w-full">
                Ver Relatório Completo
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-academy-pink" />
                <h3 className="font-medium">Preferências dos Alunos</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Aeróbica anos 80</span>
                    <span>24 likes</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full mt-1">
                    <div className="h-2 bg-academy-purple rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Step anos 90</span>
                    <span>32 likes</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full mt-1">
                    <div className="h-2 bg-academy-blue rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Cardio Funk</span>
                    <span>36 likes</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full mt-1">
                    <div className="h-2 bg-academy-pink rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AulasTematicasRetro;
