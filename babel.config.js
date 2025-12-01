module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    root: ["./"],
                    alias: {
                        "@": "./src/",
                        "@app": "./src/app",
                        "@component": "./src/components",
                        "@service": "./src/services",
                        "@lib": "./src/libs",
                        "@hook": "./src/hooks",
                        "@provider": "./src/providers",
                        "@type": "./src/types",
                        "@asset": "./assets",
                        "@style": "./src/styles",
                        "@config": "./src/configs",
                    },
                    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
                },
            ],
            "expo-router/babel",
        ],
    };
};
