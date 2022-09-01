# EPW Visualizer

This app is going to be a simple EPW weather visualizer.

There will be two pages on the site.

#### Landing Page
The landing page will be an interactive map with weather stations on. As seen many other places (i.e. EnergyPlus and Ladybug).

When a user clicks on a weather station they are taken to the second page, where the visualizations will be.

#### Visualizations Page
The visualization page will consist of several key charts of the data and a table with the actual EPW data in.

# Frameworks and Libraries
* [Typescript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [React](https://reactjs.org/)
* [MUI](https://mui.com/)
* [TanStack/React Query](https://tanstack.com/query/v4)
* [VisX](https://airbnb.io/visx/)
* [Vitest](https://vitest.dev/)

# Deployment
* [Simply](https://www.simply.com)
* [Netlify](https://netlify.com)
* [epw.kongsgaard.eu](https://epw.kongsgaard.eu)

# Folder Structure
```
src/
  # Folder for static assets such as images 
  assets/
  
  # Folder for the different pages, like mapPage and visualizationPage
  pages/
  
  # Folder for UI components. Components can be used across different pages.
  components/
    # Each component has its own folder. 
    # That way we can have one file for the acutal component and 
    # another for the test (.spec.tsx) of the component.
    myComponent/
        myComponent.tsx
        myComponent.spec.tsx
        index.tsx
        
  # Folder for utilities for styling the app
  style/
  
  # main.tsx is the main entrypoint of the app.
  main.tsx
```

# Get Started
## Installation
Make sure that you have [NodeJS](https://nodejs.org/en/) and [Git](https://git-scm.com/) installed.

## Get Code
* Fork and Clone GitHub Repo
* Install Node packages: `npm install`
* Run development server: `npm run dev`