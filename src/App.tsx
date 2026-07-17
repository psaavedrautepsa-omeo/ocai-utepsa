import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  BookOpen, 
  Users, 
  Newspaper, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  BarChart3,
  TrendingUp,
  FileText,
  Award,
  Calendar,
  ExternalLink,
  GraduationCap,
  Download,
  Heart,
  Monitor,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Hook para contador animado
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { ref, count };
}

// Hook personalizado para animaciones de scroll
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Componente wrapper para animaciones de scroll
function ScrollReveal({ 
  children, 
  className = '', 
  animation = 'fadeInUp',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  animation?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  
  const animationClasses = {
    fadeInUp: 'animate-fade-in-up',
    fadeIn: 'animate-fade-in',
    slideInLeft: 'animate-slide-in-left',
    slideInRight: 'animate-slide-in-right',
    scaleIn: 'animate-scale-in'
  };
  
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function StatCounter({ target, label, delay = 0 }: { target: number; label: string; delay?: number }) {
  const { ref, count } = useCountUp(target, 1500 + delay);
  return (
    <ScrollReveal animation="scaleIn" delay={delay}>
      <div ref={ref} className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-bold text-utepsa-red mb-1">{count}+</div>
        <div className="text-sm text-utepsa-gray-light">{label}</div>
      </div>
    </ScrollReveal>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'quienes-somos', label: 'Quienes Somos', icon: <Users className="w-4 h-4" /> },
    { id: 'publicaciones', label: 'Publicaciones', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'noticias', label: 'Noticias', icon: <Newspaper className="w-4 h-4" /> },
  ];

  // Estado para modales
  const [investigadorSeleccionado, setInvestigadorSeleccionado] = useState<Investigador | null>(null);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<typeof noticias[0] | null>(null);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<typeof publicaciones[0] | null>(null);

  const [mostrarTodasPublicaciones, setMostrarTodasPublicaciones] = useState(false);

  // Estados para filtros de publicaciones
  const [filtroLinea, setFiltroLinea] = useState('');
  const [filtroAño, setFiltroAño] = useState('');
  const [filtroAutorPublicacion, setFiltroAutorPublicacion] = useState('');

  // Líneas de investigación: ecosistema interdisciplinario real del OCAI
  const lineasInvestigacion = [
    { id: 'ciencias-empresariales', nombre: 'Ciencias Empresariales', icono: <BarChart3 className="w-5 h-5" />, color: 'bg-blue-500' },
    { id: 'tecnologia', nombre: 'Tecnología', icono: <Monitor className="w-5 h-5" />, color: 'bg-purple-500' },
    { id: 'ciencias-juridicas-sociales', nombre: 'Ciencias Jurídicas y Sociales', icono: <Heart className="w-5 h-5" />, color: 'bg-rose-500' },
    { id: 'humanidades', nombre: 'Humanidades', icono: <GraduationCap className="w-5 h-5" />, color: 'bg-orange-500' },
  ];

  // Datos de publicaciones y análisis del OCAI
  const publicaciones = [
    { titulo: "Mercenarios, diplomacia y la privatización de la guerra: el desafío que Bolivia no puede ignorar", autores: "Lic. Miguel Francisco Jiménez Canido", año: "2026", linea: "ciencias-juridicas-sociales", enlace: "https://v3.utepsa.edu/index.php/universidad/noticias/486-mercenarios-diplomacia-y-la-privatizacion-de-la-guerra-el-desafio-que-bolivia-no-puede-ignorar", imagen: "/noticia_mercenarios.jpg", resumen: "Publicado en el sitio oficial de UTEPSA (16 de julio de 2026). El autor analiza la privatización del conflicto armado a partir del caso de ciudadanos bolivianos presuntamente vinculados a fuerzas militares rusas en Ucrania, la erosión del monopolio estatal de la fuerza desde la Paz de Westfalia, y propone recomendaciones para la respuesta diplomática de Bolivia, incluyendo protección consular y cooperación internacional." },
    { titulo: "La gobernanza del fútbol mundial", autores: "Lic. Elena M. Camacho Quintela", año: "2026", linea: "humanidades", enlace: "https://v3.utepsa.edu/index.php/universidad/noticias/482-la-gobernanza-del-futbol-mundial", imagen: "/noticia_gobernanza_futbol.png", resumen: "Publicado en el sitio oficial de UTEPSA (2 de julio de 2026). La Directora del Observatorio examina el rol de la FIFA como actor no estatal con poder geopolítico, sintetizando las teorías del realismo, el institucionalismo liberal y el constructivismo para explicar la gobernanza deportiva internacional y la diplomacia cultural de \"pueblo a pueblo\" en los mundiales de fútbol." },
    { titulo: "La confianza en disputa: la defensoría y el bienestar universitario en tiempos de IA", autores: "MSc. Juan Carlos Peña Gutiérrez", año: "2026", linea: "ciencias-juridicas-sociales", enlace: "https://erasmusbravioo.com/la-confianza-en-disputa-la-defensoria-y-el-bienestar-universitario-en-tiempos-de-ia/", imagen: "/pub_defensoria_ia.png", resumen: "Publicado en el marco del Proyecto Erasmus+ BRAVIOO. El autor analiza cómo la Defensoría o el área de Bienestar Universitario ya no actúa solo desde un espacio institucional tradicional, sino inmersa en el mismo ecosistema digital que atraviesa a la comunidad, donde la IA puede ser una herramienta valiosa si se usa con criterio, pero también amplificar los conflictos si no existe una gobernanza clara. Concluye que la IA puede apoyar pero no reemplazar el juicio humano en decisiones que afectan a las personas." },
    { titulo: "Actualización imperativa para el comunicólogo moderno: entre la ética y la obsolescencia digital", autores: "MSc. Juan Carlos Peña Gutiérrez", año: "2025", linea: "tecnologia", enlace: "https://nuevapresencia.com/actualizacion-imperativa-para-el-comunicologo-moderno-entre-la-etica-y-la-obsolescencia-digital/", imagen: "/pub_comunicologo.webp", resumen: "Publicado en Nueva Presencia (noviembre de 2025). Un ensayo que sostiene que, ante el avance de la IA generativa, la actualización profesional ha dejado de ser una opción para convertirse en una obligación ética. El autor identifica los factores estructurales y psicológicos que perpetúan la inercia frente a la formación continua, y advierte que actuar desde el conocimiento obsoleto puede llevar a simplificar situaciones complejas o contribuir a la desinformación." },
    { titulo: "Diplomacia académica y diálogo de civilizaciones: el puente estratégico entre China y América Latina", autores: "Lic. Miguel Francisco Jiménez Canido", año: "2026", linea: "ciencias-juridicas-sociales", enlace: "https://nuevapresencia.com/diplomacia-academica-y-dialogo-de-civilizaciones-el-puente-estrategico-entre-china-y-america-latina/", imagen: "https://nuevapresencia.com/wp-content/uploads/2026/06/jimenez.webp", resumen: "Publicado en Nueva Presencia (junio de 2026). El Lic. Miguel Jiménez analiza el papel de la diplomacia académica como puente estratégico para fortalecer el diálogo entre China y América Latina, una reflexión sobre la cooperación educativa, cultural y científica en la construcción de relaciones internacionales más sólidas y sostenibles." },
    { titulo: "\"Together, we are America\": cultura pop, poder simbólico y disputa por el significado de América", autores: "Elena Mercedes Camacho Quintela", año: "2026", linea: "humanidades", enlace: "https://www.facebook.com/story.php?story_fbid=pfbid0iKTiJKYYyATppaPRWejM94wRX3mnAhbjBXybxbongsMucStWgiAyCnuXLmcsm7ml&id=100057537486060", imagen: "/noticia_superbowl.jpg", resumen: "Análisis del Super Bowl 2026 como lección clave para las Relaciones Internacionales: cómo la cultura pop también disputa el significado de \"América\"." },
    { titulo: "La IA según Harari, en Davos: el \"cuchillo que decide\" y el \"nuevo inmigrante\"", autores: "MSc. Juan Carlos Peña Gutiérrez", año: "2026", linea: "tecnologia", enlace: "https://barcelonadot.es/la-ia-segun-harari-en-davos-el-cuchillo-que-decide-y-el-nuevo-inmigrante/", imagen: "/pub_harari_davos.jpg", resumen: "Publicado en BarcelonaDot (23 de enero de 2026). El historiador Yuval Noah Harari, en el Foro Económico Mundial de Davos, plantea que la IA ya no es una simple herramienta pasiva sino un \"agente\" capaz de aprender y decidir por sí mismo: \"la IA es como un cuchillo que no solo corta, sino que además decide cuándo y para qué usarlo\". El análisis destaca cómo el control del lenguaje -base del derecho, los contratos y el discurso público- otorga a la IA un poder de influencia significativo, y retoma la metáfora del \"nuevo inmigrante\" para describir las tensiones que genera su integración en la sociedad. Concluye que urge establecer marcos regulatorios antes de que la IA se convierta en la arquitecta silenciosa de la opinión pública." },
    { titulo: "La fotografía como herramienta de guerra psicológica en la coyuntura internacional", autores: "Luis Marcelo Huanca", año: "2026", linea: "humanidades", enlace: "https://nuevapresencia.com/la-fotografia-como-herramienta-de-guerra-psicologica-en-la-coyuntura-internacional/", imagen: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=400&q=80", resumen: "Publicado en Nueva Presencia (21 de enero de 2026). Análisis sobre el uso de la imagen fotográfica como instrumento de guerra psicológica." },
    { titulo: "Análisis prospectivo sobre los hechos acaecidos en Venezuela", autores: "Entrevista a la Dra. Ana Soliz de Stange", año: "2026", linea: "ciencias-juridicas-sociales", enlace: "https://youtube.com/watch?v=HfJRW8_xFyQ", imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80", resumen: "Doctora en Ciencia Política por la Universidad de Hamburgo (Alemania). Entrevista en video sobre la coyuntura venezolana." },
    { titulo: "Análisis del Decreto Supremo No 5516", autores: "Dr. Jorge Plaza F.", año: "2026", linea: "ciencias-juridicas-sociales", enlace: "https://youtube.com/watch?v=VEYkJVbZXb4", imagen: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?auto=format&fit=crop&w=400&q=80", resumen: "Abogado con experiencia en temas legales, financieros y tributarios. Análisis sobre la anulación del Decreto Supremo 5503 y la aprobación del DS 5516." },
    { titulo: "Bolivia y Chile: una nueva etapa en el relacionamiento bilateral", autores: "Equipo del Observatorio", año: "2026", linea: "ciencias-juridicas-sociales", enlace: null, imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80", resumen: "Presentación del análisis sobre el relacionamiento bilateral entre Bolivia y Chile." },
  ];

  // Filtrar publicaciones
  const publicacionesFiltradas = publicaciones.filter(pub => {
    const matchLinea = !filtroLinea || pub.linea === filtroLinea;
    const matchAño = !filtroAño || pub.año === filtroAño;
    const matchAutor = !filtroAutorPublicacion || pub.autores.toLowerCase().includes(filtroAutorPublicacion.toLowerCase());
    return matchLinea && matchAño && matchAutor;
  });

  // Opciones para filtros
  const añosDisponibles = [...new Set(publicaciones.map(p => p.año))].sort((a, b) => b.localeCompare(a));

  // Datos de noticias
  interface Noticia {
    titulo: string;
    fecha: string;
    resumen: string;
    contenidoCompleto: string;
    imagen: string;
    imagenExtra?: string;
    enlace?: string;
  }

  const noticias: Noticia[] = [
    {
      titulo: "Mercenarios, diplomacia y la privatización de la guerra: el desafío que Bolivia no puede ignorar",
      fecha: "Julio 2026",
      resumen: "El Lic. Miguel Francisco Jiménez Canido, Analista del Observatorio de Coyuntura y Asuntos Internacionales, analiza la privatización del conflicto armado a partir del caso de ciudadanos bolivianos presuntamente vinculados a fuerzas militares rusas en Ucrania, y su desafío para la diplomacia boliviana.",
      contenidoCompleto: "Por Lic. Miguel Francisco Jiménez Canido, Analista del Observatorio de Coyuntura y Asuntos Internacionales.\n\nEl artículo examina la privatización del conflicto armado contemporáneo a partir del caso de ciudadanos bolivianos presuntamente vinculados a fuerzas militares rusas en Ucrania. El autor sostiene que la guerra contemporánea se ha transformado de un dominio exclusivamente estatal a un espacio donde operan compañías militares privadas, contratistas de seguridad y redes de reclutamiento transnacional.\n\nEntre los temas centrales: la erosión del monopolio estatal de la fuerza desde la Paz de Westfalia de 1648, cómo las empresas militares privadas y las estructuras híbridas difuminan la distinción tradicional entre combatientes y contratistas, la vulnerabilidad de las personas captadas mediante ofertas de empleo aparentemente legítimas, recomendaciones para la respuesta diplomática de Bolivia -incluyendo la protección consular y la cooperación internacional-, la importancia de fortalecer los marcos jurídicos internacionales que rigen las operaciones militares privadas, y el rol de la Corte Penal Internacional frente a estructuras de rendición de cuentas fragmentadas.\n\nEl autor concluye que \"la diplomacia sigue siendo el instrumento más eficaz para defender la vida, la soberanía y el Estado de derecho\" en una era donde el conflicto se ha comercializado.",
      imagen: "/noticia_mercenarios.jpg",
      enlace: "https://v3.utepsa.edu/index.php/universidad/noticias/486-mercenarios-diplomacia-y-la-privatizacion-de-la-guerra-el-desafio-que-bolivia-no-puede-ignorar"
    },
    {
      titulo: "La gobernanza del fútbol mundial",
      fecha: "Julio 2026",
      resumen: "La Lic. Elena Camacho Quintela, Directora del Observatorio de Coyuntura y Asuntos Internacionales, analiza a la FIFA como actor no estatal con poder geopolítico, combinando las teorías de relaciones internacionales del realismo, el institucionalismo liberal y el constructivismo.",
      contenidoCompleto: "Por Lic. Elena M. Camacho Quintela, Directora del Observatorio de Coyuntura y Asuntos Internacionales de UTEPSA.\n\nEl artículo examina el rol de la FIFA como actor no estatal con un poder geopolítico considerable, sintetizando tres teorías de las Relaciones Internacionales —el realismo, el institucionalismo liberal y el constructivismo— para explicar el funcionamiento de la gobernanza deportiva internacional.\n\nEl análisis destaca episodios de diplomacia cultural durante los mundiales de fútbol, tomando como referencia el comportamiento de las hinchadas japonesa y jordana como ejemplos de una \"diplomacia de pueblo a pueblo\" que trasciende la competencia tradicional de poder.\n\nEntre los temas centrales: la autonomía regulatoria y la autoridad supranacional de la FIFA, el deporte como construcción de identidad y mecanismo diplomático, la tensión entre el multilateralismo cooperativo y las jerarquías de poder, y el poder blando cultural ejercido por actores no gubernamentales.",
      imagen: "/noticia_gobernanza_futbol.png",
      enlace: "https://v3.utepsa.edu/index.php/universidad/noticias/482-la-gobernanza-del-futbol-mundial"
    },
    {
      titulo: "Detrás del Spot: Comunicación y Política en el escenario electoral de Santa Cruz 2026",
      fecha: "Marzo 2026",
      resumen: "La política también se analiza desde la comunicación. UTEPSA invita a \"Detrás del Spot: Comunicación y Política en el escenario electoral de Santa Cruz 2026\", una actividad académica del Observatorio de Coyuntura y Asuntos Internacionales.",
      contenidoCompleto: "La política también se analiza desde la comunicación. UTEPSA invita a \"Detrás del Spot: Comunicación y Política en el escenario electoral de Santa Cruz 2026\", una actividad académica del Observatorio de Coyuntura y Asuntos Internacionales.\n\nUn análisis académico desde lo político y comunicacional, de los spots audiovisuales de campañas de candidatos a la Gobernación y Alcaldía de Santa Cruz: una mirada crítica, actual y universitaria sobre los mensajes que marcan la campaña.\n\nExpositores: Lic. Miguel Francisco Jiménez Canido y Lic. Juan Carlos Peña Gutiérrez, Analistas del Observatorio de Coyuntura y Asuntos Internacionales.\n\nMiércoles 18 de marzo, 08:30 hrs. Lugar: Sala E-300.",
      imagen: "/noticia_detras_del_spot.jpg",
      enlace: "https://www.facebook.com/story.php?story_fbid=pfbid02FXhghVJhLR33CSiGfs5G1k9wPAQhKb3yjoy8eHktptBvrMRSZtYHsy9VKqT1dgkbl&id=100064690416565"
    },
    {
      titulo: "Geopolítica y equilibrio de poder: Elena Camacho expone en la Universidad Regiomontana (México)",
      fecha: "Marzo 2026",
      resumen: "La Lic. Elena Camacho, Jefe de la Carrera de Relaciones Internacionales y coordinadora del proyecto del Observatorio, fue invitada por el programa de posgrado en Pensamiento Crítico de la Universidad Regiomontana (México) para exponer sobre \"Geopolítica y equilibrio de poder\".",
      contenidoCompleto: "La Lic. Elena Camacho, Jefe de la Carrera de Relaciones Internacionales y coordinadora del proyecto del Observatorio de UTEPSA, fue invitada por el programa de posgrado en Pensamiento Crítico de la Universidad Regiomontana (México) para exponer sobre \"Geopolítica y equilibrio de poder\", ofreciendo un análisis sobre las dinámicas actuales del sistema internacional.\n\nLa institución valora estos intercambios académicos que fortalecen la formación, el pensamiento crítico y la visibilidad de la comunidad universitaria.",
      imagen: "/noticia_geopolitica_regiomontana.jpg",
      enlace: "https://www.facebook.com/story.php?story_fbid=pfbid0r5vhxqTiNEQ9Sh9whYK2YE61egNEdgwTdszy7pohhdC3FgJuJJukQNJEm6Nubk9cl&id=100064690416565"
    },
    {
      titulo: "Cooperación para el desarrollo desde lo local: experiencias, desafíos y nuevas perspectivas",
      fecha: "Marzo 2026",
      resumen: "La carrera de Relaciones Internacionales de UTEPSA, junto al Observatorio de Coyuntura y Asuntos Internacionales, organizó un foro académico sobre cooperación para el desarrollo, con la participación de Natalia Álvarez G. (Rectora de la Universidad Nacional de La Rioja, Argentina), Carmen Antelo N. (Directora de Cooperación y Relaciones Internacionales de la Gobernación de Santa Cruz) y el académico Toshiro Miki V.",
      contenidoCompleto: "La carrera de Relaciones Internacionales de UTEPSA, junto al Observatorio de Coyuntura y Asuntos Internacionales, organizó el foro académico \"Cooperación para el desarrollo desde lo local: experiencias, desafíos y nuevas perspectivas\".\n\nParticiparon Natalia Álvarez G. (Rectora de la Universidad Nacional de La Rioja, Argentina), Carmen Antelo N. (Directora de Cooperación y Relaciones Internacionales de la Gobernación de Santa Cruz) y el académico Toshiro Miki V., quienes debatieron sobre los desafíos actuales de la cooperación para el desarrollo.\n\nLos estudiantes de Relaciones Internacionales participaron activamente, fortaleciendo su formación académica a través del análisis de experiencias reales de cooperación y gestión territorial.",
      imagen: "/noticia_cooperacion_desarrollo.jpg",
      enlace: "https://www.facebook.com/story.php?story_fbid=pfbid02e2esqAdiRUK3mCZQZga2M5sHya1YmCcTuxRccTsT9XzTTKWtwr7uejjvjPuEEuNGl&id=100057537486060"
    },
    {
      titulo: "\"Together, we are America\": cultura pop, poder simbólico y disputa por el significado de América",
      fecha: "Febrero 2026",
      resumen: "No fue solo música. Fue identidad, poder y geopolítica. El Super Bowl 2026 nos dejó una lección clave para las Relaciones Internacionales: descubre cómo la cultura pop también disputa el significado de \"América\".",
      contenidoCompleto: "No fue solo música. Fue identidad, poder y geopolítica.\n\nEl Super Bowl 2026 nos dejó una lección clave para las Relaciones Internacionales: cómo la cultura pop también disputa el significado de \"América\".\n\nArtículo de la Lic. Elena Mercedes Camacho Quintela, Directora del Observatorio de Coyuntura y Asuntos Internacionales.",
      imagen: "/noticia_superbowl.jpg",
      enlace: "https://www.facebook.com/story.php?story_fbid=pfbid0iKTiJKYYyATppaPRWejM94wRX3mnAhbjBXybxbongsMucStWgiAyCnuXLmcsm7ml&id=100057537486060"
    },
    {
      titulo: "La IA según Harari, en Davos: el \"cuchillo que decide\" y el \"nuevo inmigrante\"",
      fecha: "Enero 2026",
      resumen: "Reflexión sobre las ideas de Yuval Noah Harari en Davos acerca de la inteligencia artificial y sus implicaciones geopolíticas, publicada en BarcelonaDot.",
      contenidoCompleto: "Por MSc. Juan Carlos Peña Gutiérrez, Miembro del Observatorio de Coyuntura y Asuntos Internacionales - UTEPSA.\n\nPublicado en BarcelonaDot (23 de enero de 2026): un análisis sobre \"el cuchillo que decide\" y el \"nuevo inmigrante\" a partir de las ideas de Yuval Noah Harari expuestas en el Foro de Davos sobre inteligencia artificial.",
      imagen: "/noticia_harari_davos.jpg"
    },
    {
      titulo: "La fotografía como herramienta de guerra psicológica en la coyuntura internacional",
      fecha: "Enero 2026",
      resumen: "Análisis publicado en Nueva Presencia sobre el uso de la imagen fotográfica como instrumento de guerra psicológica en los conflictos actuales.",
      contenidoCompleto: "Por Luis Marcelo Huanca.\n\nPublicado en Nueva Presencia, Diario Digital Independiente (21 de enero de 2026): un análisis sobre cómo la fotografía se ha convertido en una herramienta de guerra psicológica dentro de la coyuntura internacional.",
      imagen: "/noticia_fotografia_guerra.jpg",
      enlace: "https://nuevapresencia.com/la-fotografia-como-herramienta-de-guerra-psicologica-en-la-coyuntura-internacional/"
    },
    {
      titulo: "Análisis prospectivo sobre los hechos acaecidos en Venezuela",
      fecha: "2026",
      resumen: "Entrevista a la Dra. Ana Soliz de Stange, Doctora en Ciencia Política por la Universidad de Hamburgo (Alemania), sobre la coyuntura venezolana.",
      contenidoCompleto: "Entrevista en video para el canal del Observatorio: análisis prospectivo sobre los hechos acaecidos en Venezuela, con la Dra. Ana Soliz de Stange, Doctora en Ciencia Política por la Universidad de Hamburgo (Alemania).",
      imagen: "/noticia_venezuela.jpg",
      enlace: "https://youtube.com/watch?v=HfJRW8_xFyQ"
    },
    {
      titulo: "Análisis del Decreto Supremo No 5516",
      fecha: "2026",
      resumen: "Conversamos con el Dr. Jorge Plaza F., abogado con experiencia en temas legales, financieros y tributarios, sobre la anulación del Decreto Supremo 5503 y la aprobación del DS 5516.",
      contenidoCompleto: "Entrevista en video para el canal del Observatorio con el Dr. Jorge Plaza F., abogado con experiencia en temas legales, financieros y tributarios, sobre la anulación del Decreto Supremo 5503 y la aprobación del Decreto Supremo 5516.",
      imagen: "/noticia_decreto5516.jpg",
      enlace: "https://youtube.com/watch?v=VEYkJVbZXb4"
    },
    {
      titulo: "Bolivia y Chile: una nueva etapa en el relacionamiento bilateral",
      fecha: "2026",
      resumen: "Desde el Observatorio de Coyuntura y Asuntos Internacionales presentamos un análisis sobre el relacionamiento bilateral entre Bolivia y Chile.",
      contenidoCompleto: "Desde el Observatorio de Coyuntura y Asuntos Internacionales presentamos un análisis sobre el relacionamiento bilateral entre Bolivia y Chile, una nueva etapa en la relación entre ambos países.",
      imagen: "https://images.unsplash.com/photo-1512076249812-fd58fb2c8748?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Interfaz para investigadores
  interface Investigador {
    id: string;
    nombre: string;
    cargo: string;
    area: string;
    imagen: string;
    publicaciones: string[];
    apellidoBusqueda?: string;
  }

  // Equipo del OCAI (miembros confirmados en la presentación institucional)
  const equipo: Investigador[] = [
    {
      id: "elena-camacho-quintela",
      nombre: "Lic. Elena Mercedes Camacho Quintela",
      cargo: "Directora del OCAI",
      area: "Dirección",
      imagen: "/elena-camacho.jpeg",
      apellidoBusqueda: "Camacho",
      publicaciones: []
    },
    {
      id: "juan-carlos-pena-gutierrez",
      nombre: "MSc. Juan Carlos Peña Gutiérrez",
      cargo: "Miembro del OCAI",
      area: "Investigación",
      imagen: "/juan-carlos-pena.jpg",
      apellidoBusqueda: "Peña",
      publicaciones: []
    },
    {
      id: "miguel-jimenez-canido",
      nombre: "Lic. Miguel Francisco Jiménez Canido",
      cargo: "Miembro del OCAI",
      area: "Investigación",
      imagen: "/miguel-jimenez.jpeg",
      apellidoBusqueda: "Jiménez",
      publicaciones: []
    },
  ];

  const getPublicacionesDeInvestigador = (miembro: Investigador) => {
    const term = (miembro.apellidoBusqueda || miembro.nombre.replace(/^MSc\.\s*/i, '').split(' ').pop() || '').toLowerCase();
    return publicaciones.filter(pub => pub.autores.toLowerCase().includes(term));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow">
                <img
                  src="/logo-ocai.png"
                  alt="Logo OCAI"
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-lg leading-tight transition-colors ${isScrolled ? 'text-utepsa-gray-dark' : 'text-white'}`}>
                  OBSERVATORIO
                </h1>
                <p className={`text-xs transition-colors ${isScrolled ? 'text-utepsa-gray-light' : 'text-white/80'}`}>
                  de Coyuntura y Asuntos Internacionales
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeSection === item.id
                      ? 'bg-utepsa-red text-white'
                      : isScrolled
                        ? 'text-utepsa-gray-dark hover:bg-utepsa-red/10 hover:text-utepsa-red'
                        : 'text-white hover:bg-white/20'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-utepsa-gray-dark' : 'text-white'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-xl border-t">
            <nav className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 flex items-center space-x-3 ${
                    activeSection === item.id
                      ? 'bg-utepsa-red text-white'
                      : 'text-utepsa-gray-dark hover:bg-utepsa-red/10 hover:text-utepsa-red'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Inicio */}
      <section id="inicio" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80"
            alt="Observatorio de Coyuntura y Asuntos Internacionales"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-utepsa-red/90 via-utepsa-red/70 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <BarChart3 className="w-3 h-3 mr-1" />
                UTEPSA - Investigación
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Observatorio de
                <span className="block">Coyuntura y Asuntos Internacionales</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
                Generando conocimiento estratégico a través del análisis de la coyuntura nacional
                y los asuntos internacionales para el desarrollo de Santa Cruz y Bolivia.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => scrollToSection('publicaciones')}
                  className="bg-white text-utepsa-red hover:bg-white/90 px-8 py-6 text-base font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ver Publicaciones
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full" />
          </div>
        </div>
      </section>

      {/* Quienes Somos Section */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="slideInLeft" delay={0}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-6">
                  Quienes Somos
                </h2>
                <p className="text-utepsa-gray-light text-lg mb-6 leading-relaxed">
                  Hoy en día, lo que sucede en el mundo ya no se siente tan lejano. Una guerra, una crisis
                  económica, una decisión política o un acuerdo internacional pueden influir directamente
                  en nuestra vida cotidiana. Entender lo que ocurre más allá de nuestras fronteras se ha
                  vuelto crucial, no solo para los expertos, sino para toda la sociedad.
                </p>
                <p className="text-utepsa-gray-light mb-4 leading-relaxed">
                  <span className="font-semibold text-utepsa-gray-dark">La misión: </span>
                  el Observatorio busca facilitar una mejor comprensión del panorama internacional actual
                  y estudiar los eventos más relevantes.
                </p>
                <p className="text-utepsa-gray-light mb-8 leading-relaxed">
                  <span className="font-semibold text-utepsa-gray-dark">El enfoque: </span>
                  acercar el conocimiento a la comunidad boliviana de forma clara, responsable y accesible.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <StatCounter target={3} label="Investigadores" delay={100} />
                  <StatCounter target={11} label="Publicaciones" delay={200} />
                  <StatCounter target={1} label="Años de experiencia" delay={300} />
                </div>

                <p className="text-sm text-utepsa-gray-light border-t pt-4">
                  El proyecto está dirigido por la Jefe de la Carrera de Relaciones Internacionales,
                  <span className="font-semibold text-utepsa-gray-dark"> Lic. Elena Mercedes Camacho Quintela</span>,
                  y cuenta con el respaldo total de UTEPSA.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slideInRight" delay={200}>
              <div className="relative">
                <img
                  src="/quienes-somos.jpg"
                  alt="Equipo del Observatorio"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-utepsa-red text-white p-6 rounded-xl shadow-xl max-w-[220px]">
                  <Award className="w-8 h-8 mb-2" />
                  <p className="font-semibold leading-snug">Compromiso con la excelencia académica y la verdad</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Equipo */}
          <div className="mt-20">
            <ScrollReveal animation="fadeInUp" delay={0}>
              <h3 className="text-2xl font-bold text-utepsa-gray-dark mb-8 text-center">
                Nuestro Equipo de Investigadores
              </h3>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <p className="text-center text-utepsa-gray-light mb-8">
                Haz clic en un investigador para ver sus publicaciones
              </p>
            </ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4">
              {equipo.map((miembro, index) => (
                <ScrollReveal key={index} className="w-full sm:w-64" animation="fadeInUp" delay={150 + index * 100}>
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                    onClick={() => setInvestigadorSeleccionado(miembro)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-20 h-20 bg-utepsa-red/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-utepsa-red group-hover:scale-110 transition-all duration-300 overflow-hidden">
                        {miembro.imagen ? (
                          <img 
                            src={miembro.imagen} 
                            alt={miembro.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-utepsa-red font-bold text-xl group-hover:text-white transition-colors">
                            {miembro.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-utepsa-gray-dark text-sm mb-1 group-hover:text-utepsa-red transition-colors">
                        {miembro.nombre}
                      </h4>
                      <p className="text-xs text-utepsa-gray-light">{miembro.cargo}</p>
                      {(() => {
                        const pubsDelMiembro = getPublicacionesDeInvestigador(miembro);
                        return pubsDelMiembro.length > 0 && (
                          <Badge
                            className="mt-2 bg-utepsa-red/10 text-utepsa-red text-xs cursor-pointer hover:bg-utepsa-red hover:text-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              const term = miembro.apellidoBusqueda || miembro.nombre.replace(/^MSc\.\s*/i, '').split(' ').pop() || '';
                              setFiltroAutorPublicacion(term);
                              setMostrarTodasPublicaciones(true);
                              setTimeout(() => document.querySelector('#publicaciones')?.scrollIntoView({ behavior: 'smooth' }), 50);
                            }}
                          >
                            {pubsDelMiembro.length} publicación{pubsDelMiembro.length !== 1 ? 'es' : ''}
                          </Badge>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Publicaciones Section - Organizado por Líneas de Investigación */}
      <section id="publicaciones" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Líneas de Investigación
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Publicaciones por Área
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Un ecosistema de análisis interdisciplinario, organizado en 4 áreas de conocimiento.
              </p>
            </ScrollReveal>
          </div>

          {/* Líneas de Investigación */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {lineasInvestigacion.map((linea) => (
              <button
                key={linea.id}
                onClick={() => setFiltroLinea(filtroLinea === linea.id ? '' : linea.id)}
                className={`p-4 rounded-xl text-center transition-all ${
                  filtroLinea === linea.id 
                    ? `${linea.color} text-white shadow-lg scale-105` 
                    : 'bg-gray-100 hover:bg-gray-200 text-utepsa-gray-dark'
                }`}
              >
                <div className={`mx-auto mb-2 ${filtroLinea === linea.id ? 'text-white' : 'text-utepsa-gray-light'}`}>
                  {linea.icono}
                </div>
                <p className="text-xs font-medium">{linea.nombre}</p>
              </button>
            ))}
          </div>

          {/* Filtro por año */}
          <div className="flex justify-center mb-8">
            <select 
              value={filtroAño}
              onChange={(e) => setFiltroAño(e.target.value)}
              className="h-10 px-4 rounded-full border border-gray-200 bg-white text-sm"
            >
              <option value="">Todos los años</option>
              {añosDisponibles.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>

          {/* Chip de filtro por autor activo */}
          {filtroAutorPublicacion && (
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-utepsa-red/10 text-utepsa-red rounded-full text-sm font-medium">
                Investigador: {filtroAutorPublicacion}
                <button
                  onClick={() => setFiltroAutorPublicacion('')}
                  className="ml-1 hover:text-utepsa-red/60 font-bold text-base leading-none"
                >×</button>
              </span>
            </div>
          )}

          {/* Grid de Publicaciones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mostrarTodasPublicaciones ? publicacionesFiltradas : publicacionesFiltradas.slice(0, 9)).map((pub, index) => {
              const lineaInfo = lineasInvestigacion.find(l => l.id === pub.linea);
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-card-hover transition-all duration-300 group overflow-hidden cursor-pointer"
                  onClick={() => setPublicacionSeleccionada(pub)}
                >
                  {/* Imagen de la publicación */}
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={pub.imagen || '/publicaciones-bg.jpg'} 
                      alt={pub.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      {lineaInfo && (
                        <Badge className={`${lineaInfo.color} text-white`}>
                          {lineaInfo.nombre}
                        </Badge>
                      )}
                      <span className="text-sm text-utepsa-gray-light flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {pub.año}
                      </span>
                    </div>
                    <CardTitle className="text-base leading-tight group-hover:text-utepsa-red transition-colors">
                      {pub.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-utepsa-gray-light mb-4">
                      <span className="font-medium">{pub.autores}</span>
                    </p>
                    {pub.enlace ? (
                      <span 
                        className="inline-flex items-center text-utepsa-red hover:text-utepsa-red/80 font-medium text-sm"
                      >
                        Ver publicación <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        Próximamente
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {publicacionesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-utepsa-gray-light">No se encontraron publicaciones con los filtros seleccionados.</p>
              <Button 
                onClick={() => {
                  setFiltroLinea('');
                  setFiltroAño('');
                  setFiltroAutorPublicacion('');
                }}
                variant="outline"
                className="mt-4 text-utepsa-red border-utepsa-red/30"
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {publicacionesFiltradas.length > 9 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setMostrarTodasPublicaciones(!mostrarTodasPublicaciones)}
                className="inline-flex items-center px-6 py-3 bg-utepsa-red hover:bg-utepsa-red/90 text-white rounded-lg font-medium transition-colors"
              >
                {mostrarTodasPublicaciones ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Ver menos publicaciones
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver todas las publicaciones ({publicacionesFiltradas.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Noticias Section */}
      <section id="noticias" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <Newspaper className="w-3 h-3 mr-1" />
                Actualidad
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Noticias y Eventos
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                El conocimiento generado se conecta con la sociedad a través de charlas con expertos y
                conferencias, análisis escritos y audiovisuales, y podcasts y publicaciones periódicas.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {noticias.map((noticia, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                {noticia.imagenExtra ? (
                  <div className="grid grid-cols-2 h-48">
                    <div className="overflow-hidden">
                      <img 
                        src={noticia.imagen} 
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <img 
                        src={noticia.imagenExtra} 
                        alt={`${noticia.titulo} - imagen 2`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-utepsa-gray-light mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {noticia.fecha}
                  </div>
                  <h3 className="font-bold text-utepsa-gray-dark mb-3 group-hover:text-utepsa-red transition-colors">
                    {noticia.titulo}
                  </h3>
                  <p className="text-sm text-utepsa-gray-light mb-4">
                    {noticia.resumen}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-utepsa-red hover:bg-utepsa-red/10 p-0 h-auto"
                    onClick={() => setNoticiaSeleccionada(noticia)}
                  >
                    Leer más <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal del Investigador */}
      {investigadorSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setInvestigadorSeleccionado(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setInvestigadorSeleccionado(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                  {investigadorSeleccionado.imagen ? (
                    <img 
                      src={investigadorSeleccionado.imagen} 
                      alt={investigadorSeleccionado.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-utepsa-red font-bold text-2xl">
                      {investigadorSeleccionado.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  )}
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-bold">{investigadorSeleccionado.nombre}</h3>
                  <p className="text-white/80">{investigadorSeleccionado.cargo}</p>
                  <Badge className="mt-2 bg-white/20 text-white border-white/30">
                    {investigadorSeleccionado.area}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {(() => {
                const pubsModal = getPublicacionesDeInvestigador(investigadorSeleccionado);
                return pubsModal.length > 0 ? (
                  <div>
                    <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-utepsa-red" />
                      Publicaciones ({pubsModal.length})
                    </h4>
                    <div className="space-y-3">
                      {pubsModal.map((pub, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-utepsa-red/5 transition-colors border-l-4 border-utepsa-red"
                        >
                          {pub.enlace && pub.enlace !== '#' ? (
                            <a href={pub.enlace} target="_blank" rel="noopener noreferrer" className="text-utepsa-gray-dark text-sm hover:text-utepsa-red transition-colors">
                              {pub.titulo} <span className="text-utepsa-gray-light">({pub.año})</span>
                            </a>
                          ) : (
                            <p className="text-utepsa-gray-dark text-sm">
                              {pub.titulo} <span className="text-utepsa-gray-light">({pub.año})</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-utepsa-gray-light mx-auto mb-3" />
                    <p className="text-utepsa-gray-light">Este investigador aún no tiene publicaciones registradas.</p>
                  </div>
                );
              })()}

              <div className="mt-6 pt-4 border-t">
                <Button 
                  onClick={() => setInvestigadorSeleccionado(null)}
                  className="w-full bg-utepsa-red hover:bg-utepsa-red/90"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Noticia */}
      {noticiaSeleccionada && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setNoticiaSeleccionada(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setNoticiaSeleccionada(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {noticiaSeleccionada.fecha}
                </Badge>
                <h3 className="text-xl font-bold text-white">{noticiaSeleccionada.titulo}</h3>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Imágenes */}
              {noticiaSeleccionada.imagenExtra ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={noticiaSeleccionada.imagen} 
                      alt={noticiaSeleccionada.titulo}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={noticiaSeleccionada.imagenExtra} 
                      alt={`${noticiaSeleccionada.titulo} - imagen 2`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden mb-6">
                  <img
                    src={noticiaSeleccionada.imagen}
                    alt={noticiaSeleccionada.titulo}
                    className="w-full max-h-80 object-contain bg-gray-50"
                  />
                </div>
              )}

              {/* Descripción completa */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-3">Descripción</h4>
                <p className="text-utepsa-gray-light leading-relaxed">
                  {noticiaSeleccionada.contenidoCompleto || noticiaSeleccionada.resumen}
                </p>
                {noticiaSeleccionada.enlace && (
                  <a
                    href={noticiaSeleccionada.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-utepsa-red/10 text-utepsa-red rounded-lg text-sm font-medium hover:bg-utepsa-red hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir a la fuente
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 mb-4">
                <p className="text-xs text-gray-400 mb-2">Compartir</p>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(noticiaSeleccionada.titulo + ' - ' + 'https://ocai-utepsa.vercel.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://ocai-utepsa.vercel.app')}&quote=${encodeURIComponent(noticiaSeleccionada.titulo)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(noticiaSeleccionada.titulo)}&url=${encodeURIComponent('https://ocai-utepsa.vercel.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.847L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => setNoticiaSeleccionada(null)}
                  className="w-full bg-utepsa-red hover:bg-utepsa-red/90"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Publicación */}
      {publicacionSeleccionada && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setPublicacionSeleccionada(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setPublicacionSeleccionada(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {publicacionSeleccionada.año}
                </Badge>
                <h3 className="text-xl font-bold text-white">{publicacionSeleccionada.titulo}</h3>
                <p className="text-white/80 text-sm mt-2">{publicacionSeleccionada.autores}</p>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Imagen */}
              <div className="rounded-xl overflow-hidden mb-6">
                <img 
                  src={publicacionSeleccionada.imagen || '/publicaciones-bg.jpg'} 
                  alt={publicacionSeleccionada.titulo}
                  className="w-full h-56 object-cover"
                />
              </div>

              {/* Resumen completo */}
              {publicacionSeleccionada.resumen && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-utepsa-red" />
                    Resumen
                  </h4>
                  <p className="text-utepsa-gray-light leading-relaxed whitespace-pre-line">
                    {publicacionSeleccionada.resumen}
                  </p>
                </div>
              )}

              {/* Enlace */}
              {publicacionSeleccionada.enlace && (
                <div className="pt-4 border-t">
                  <a
                    href={publicacionSeleccionada.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-6 py-4 bg-utepsa-red hover:bg-utepsa-red/90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Ver publicación completa
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              )}

              <div className="mt-4">
                <Button 
                  onClick={() => setPublicacionSeleccionada(null)}
                  variant="outline"
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/59178184202"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Contáctanos por WhatsApp"
      >
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-utepsa-gray-dark text-white py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo-ocai.png"
                    alt="Logo OCAI"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold">OBSERVATORIO</h3>
                  <p className="text-xs text-white/60">de Coyuntura y Asuntos Internacionales</p>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Generando conocimiento estratégico para el desarrollo de Santa Cruz y Bolivia.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => scrollToSection(item.id)}
                      className="hover:text-utepsa-red transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-utepsa-red" />
                  UTEPSA, Santa Cruz, Bolivia
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-utepsa-red" />
                  ocai@utepsa.edu.bo
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-utepsa-red" />
                  +591 (3) 3639000
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="bg-white/10 my-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
            <p>© 2026 Observatorio de Coyuntura y Asuntos Internacionales - UTEPSA. Todos los derechos reservados.</p>
            <p className="mt-2 md:mt-0">
              Universidad Tecnológica Privada de Santa Cruz
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
