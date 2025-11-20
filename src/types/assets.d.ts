// src/types/assets.d.ts

// 1. Declaración para archivos de imagen comunes
declare module "*.png" {
    const value: import("react-native").ImageSourcePropType;
    export default value;
}

declare module "*.jpg" {
    const value: import("react-native").ImageSourcePropType;
    export default value;
}

declare module "*.jpeg" {
    const value: import("react-native").ImageSourcePropType;
    export default value;
}

// Opcional: Si usas íconos o fuentes
declare module "*.ttf";
declare module "*.woff";
// ...
