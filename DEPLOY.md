# Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar tu aplicación "glocerova---educación-tecnológica" en Vercel.

## 1. Preparación Local

Asegúrate de tener instaladas las dependencias:

```bash
npm install
```

Prueba la aplicación localmente:

```bash
npm run dev
```

## 2. Configuración de API Key

Para que la aplicación funcione, necesita una API Key de Google Gemini.

1.  Consigue tu API Key en [Google AI Studio](https://aistudio.google.com/).
2.  Crea un archivo `.env.local` en la raíz del proyecto (si no existe) y agrega:
    ```
    GEMINI_API_KEY=tu_api_key_aqui
    ```

## 3. Despliegue en Vercel

Hay dos formas principales de desplegar:

### Opción A: Usando Git (Recomendada)

1.  Sube tu código a un repositorio en GitHub, GitLab o Bitbucket.
2.  Inicia sesión en [Vercel](https://vercel.com) e importa tu repositorio.
3.  En la configuración del proyecto en Vercel:
    *   **Framework Preset**: Vite
    *   **Environment Variables**: Añade una nueva variable:
        *   Name: `GEMINI_API_KEY`
        *   Value: `tu_api_key_aqui` (La misma que usaste localmente o una nueva de producción)
4.  Haz clic en **Deploy**.

### Opción B: Usando Vercel CLI

1.  Instala Vercel CLI: `npm i -g vercel`
2.  Ejecuta el comando en la raíz del proyecto:
    ```bash
    vercel
    ```
3.  Sigue las instrucciones en pantalla.
4.  Cuando te pida configurar variables de entorno, asegúrate de añadir `GEMINI_API_KEY`.

## Notas Importantes

*   **Seguridad**: Nunca subas tu archivo `.env` o `.env.local` al repositorio público. El archivo `.gitignore` ya está configurado para evitar esto.
*   **Rutas**: Se ha incluido un archivo `vercel.json` para asegurar que la navegación (React Router) funcione correctamente en el despliegue.
