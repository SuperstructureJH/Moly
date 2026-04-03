const fs = require('fs');
let content = fs.readFileSync('src/components/DigitalCard08Themes.tsx', 'utf8');

// Export AnimatedWaves
content = content.replace(/const AnimatedWaves/g, 'export const AnimatedWaves');

// Components that need profileData
const componentsToUpdate = [
    'BaseInfoWater',
    'StandardBaseInfo',
    'HeroBase',
    'HeroMetal',
    'HeroWood',
    'HeroWater',
    'HeroFire',
    'HeroEarth',
    'BaseInfoMetal',
    'BaseInfoFire'
];

componentsToUpdate.forEach(comp => {
    // StandardBaseInfo already has { theme }: { theme: string }
    if (comp === 'StandardBaseInfo') {
        content = content.replace(
            `const StandardBaseInfo = ({ theme }: { theme: string }) => {`,
            `export const StandardBaseInfo = ({ theme, profileData }: { theme: string, profileData: any }) => {`
        );
        // Also fix the calls inside StandardBaseInfo
        content = content.replace(/<BaseInfoWater \/>/g, '<BaseInfoWater profileData={profileData} />');
        content = content.replace(/<BaseInfoMetal \/>/g, '<BaseInfoMetal profileData={profileData} />');
        content = content.replace(/<BaseInfoFire \/>/g, '<BaseInfoFire profileData={profileData} />');
    } else {
        // Normal parameterless component
        // 1. Arrow function with parens `const Comp = () => (`
        let regex = new RegExp(`const ${comp} = \\(\\) => \\(`, 'g');
        content = content.replace(regex, `export const ${comp} = ({ profileData }: { profileData: any }) => (`);
        
        // 2. Arrow function with block `const Comp = () => {`
        let regex2 = new RegExp(`const ${comp} = \\(\\) => \\{`, 'g');
        content = content.replace(regex2, `export const ${comp} = ({ profileData }: { profileData: any }) => {`);
    }
});

// Remove the default DigitalCard08Demo and old profileData definition
content = content.replace(/const profileData = \{[\s\S]*?\};\n\n\n/m, '');

// Also remove everything from "// ======= 4. Complete Page Mockup =======" or "const DigitalCard08Demo = () => {" downwards
const pageIndex = content.indexOf('const DigitalCard08Demo = () => {');
if (pageIndex !== -1) {
    content = content.substring(0, pageIndex);
}

fs.writeFileSync('src/components/DigitalCard08Themes.tsx', content);
console.log('Fixed digital card components');
