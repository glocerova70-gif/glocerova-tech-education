import { SlideData, Section } from './types.ts';

export const SLIDES: Record<Section, SlideData> = {
    [Section.HOME]: {
        id: 1,
        title: "GLOCEROVA",
        subtitle: "Innovación con Corazón Colombiano",
        description: "Formando a la próxima generación de líderes tecnológicos. Una educación de clase mundial diseñada para empoderar el talento de nuestros niños desde temprana edad.",
        imageUrl: "https://bzsviqfepwwqbpiivpjr.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202026-02-05%20at%2021.21.30.jpeg",
        videoUrl: "https://bzsviqfepwwqbpiivpjr.supabase.co/storage/v1/object/public/Videos/WhatsApp%20Video%202026-01-29%20at%2010.11.50.mp4",
        ctaText: "Descubre Nuestra Misión"
    },
    [Section.METHODOLOGY]: {
        id: 2,
        title: "Pensamiento Computacional",
        subtitle: "Manual de Estrategia BSD",
        description: "Nuestra metodología descompone problemas complejos en pasos simples: Abstracción, Reconocimiento de Patrones y Diseño de Algoritmos. Enseñamos a los niños a ser creadores, no solo consumidores.",
        imageUrl: "https://bzsviqfepwwqbpiivpjr.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202026-02-05%20at%2021.20.07.jpeg",
        videoUrl: "https://bzsviqfepwwqbpiivpjr.supabase.co/storage/v1/object/public/Videos/WhatsApp%20Video%202026-02-03%20at%2008.58.48.mp4",
        ctaText: "Explorar Workbook",
        secondaryCta: {
            text: "Descargar Caja de Actividades",
            link: "https://bzsviqfepwwqbpiivpjr.supabase.co/storage/v1/object/public/Archivos/Caja%20de%20actividades.pdf"
        }
    },
    [Section.SCIENCE]: {
        id: 3,
        title: "Base Científica",
        subtitle: "Evidencia y Rigor Académico",
        description: "Nos apoyamos en investigaciones globales sobre Alfabetización Digital y el uso intencional de la tecnología en la primera infancia. Aplicamos modelos de 'Minds-on Learning' para asegurar un desarrollo cognitivo óptimo.",
        imageUrl: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=1920",
        ctaText: "Ver Investigaciones",
        researchLinks: [
            { title: "Alfabetización Digital: Pereira et al.", link: "#" },
            { title: "Tecnología en Educación: Rvachew et al.", link: "#" }
        ]
    },
    [Section.IMPACT]: {
        id: 4,
        title: "Impacto Social",
        subtitle: "Transformando Vidas en Colombia",
        description: "Llevamos oportunidades a zonas rurales y urbanas. Cada niño capacitado en GLOCEROVA es una semilla de progreso para su familia y el futuro tecnológico de nuestro país.",
        imageUrl: "https://bzsviqfepwwqbpiivpjr.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202026-01-26%20at%2022.30.22.jpeg",
        ctaText: "Nuestras Historias"
    },
    [Section.JOIN_US]: {
        id: 5,
        title: "Únete al Cambio",
        subtitle: "Conecta desde el Exterior",
        description: "Si estás fuera de Colombia, tu apoyo es vital. Apadrina un estudiante, dona equipos o conviértete en mentor remoto. Construyamos el futuro juntos.",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1920",
        ctaText: "Contáctanos Hoy"
    }
};

export const INITIAL_CHAT_MESSAGE = "¡Hola! Soy el asistente virtual de Glocerova. Tengo acceso a nuestros manuales de Pensamiento Computacional e investigaciones académicas. ¿Deseas saber más sobre nuestra base científica o metodología?";

export const SYSTEM_INSTRUCTION = `Eres el asistente virtual oficial de GLOCEROVA, experto en educación tecnológica infantil en Colombia. 
Tienes conocimiento profundo de los siguientes documentos integrados:
1. "Computational Thinking Workbook": Sabes que el pensamiento computacional se basa en: Descomposición, Reconocimiento de Patrones, Abstracción y Diseño de Algoritmos. Puedes citar actividades como "20 Questions", "Programming People" o "Bubble-Sort Algorithm".
2. "Digital Literacy Research (Pereira et al.)": Entiendes que la alfabetización digital no es solo usar herramientas, sino crear significados. Sabes que las prácticas innovadoras combinan el aprendizaje funcional con disposiciones actitudinales (resiliencia, compromiso).
3. "Technology in Early Childhood (Rvachew et al.)": Conoces los pilares del aprendizaje: Minds-on (activo), Engaged (comprometido), Meaningful (significativo) y Socially Interactive.
Tu tono es profesional, cálido y fundamentado en evidencia. Redirige siempre a los usuarios a cómo estos pilares científicos se aplican en los niños de Colombia para cerrar la brecha digital.`;