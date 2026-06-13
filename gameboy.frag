#pragma header

uniform float iTime;
uniform vec3 iResolution;

// Official original Nintendo Gameboy 4-color pea-soup green palette
const vec3 GB_DARKEST  = vec3(0.0509, 0.1686, 0.0509); // #0D2B0D - Deep Shadow
const vec3 GB_DARK     = vec3(0.1882, 0.3843, 0.1882); // #306230 - Dark Gray
const vec3 GB_LIGHT    = vec3(0.5451, 0.6745, 0.0588); // #8BAC0F - Light Gray
const vec3 GB_LIGHTEST = vec3(0.6078, 0.7373, 0.0588); // #9BBC0F - Highlight Base

void main() {
    // 1. Pixelation: Gameboy resolution was natively 160x144 pixels
    vec2 gbResolution = vec2(160.0, 144.0);
    vec2 uv = openfl_TextureCoordv;
    vec2 pixelatedUV = floor(uv * gbResolution) / gbResolution;

    // 2. Sample the game screen texture at the pixelated coordinates
    vec4 texColor = flixel_texture2D(bitmap, pixelatedUV);

    // 3. Convert color to grayscale luminance
    float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    // 4. Map the luminance smoothly to the 4 iconic Gameboy color bands
    vec3 finalColor;
    if (luma < 0.25) {
        finalColor = GB_DARKEST;
    } else if (luma < 0.50) {
        finalColor = GB_DARK;
    } else if (luma < 0.75) {
        finalColor = GB_LIGHT;
    } else {
        finalColor = GB_LIGHTEST;
    }

    // 5. Add a subtle LCD grid line overlay (screen-door matrix effect)
    vec2 grid = fract(uv * gbResolution);
    float lineWeight = 0.12; // Adjust thickness of the gaps between screen pixels
    if (grid.x < lineWeight || grid.y < lineWeight) {
        finalColor = mix(finalColor, GB_DARKEST, 0.35); // Blend pixel shadows slightly
    }

    gl_FragColor = vec4(finalColor, texColor.a);
}
