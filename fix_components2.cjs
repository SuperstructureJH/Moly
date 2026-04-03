const fs = require('fs');
let content = fs.readFileSync('src/components/DigitalCard08Themes.tsx', 'utf8');

const toReplaceParen = [
    'HeroBase', 'HeroWood', 'HeroWater', 'HeroFire', 'HeroEarth', 'BaseInfoFire'
];

toReplaceParen.forEach(comp => {
    content = content.replace(new RegExp(`const ${comp} = \\(\\) => \\(`, 'g'), 
        `export const ${comp} = () => {\n    const profileData = React.useContext(ProfileContext);\n    return (`);
});

const toReplaceCurly = [
    'HeroMetal', 'BaseInfoMetal', 'BaseInfoWater'
];

toReplaceCurly.forEach(comp => {
    content = content.replace(new RegExp(`const ${comp} = \\(\\) => \\{`, 'g'), 
        `export const ${comp} = () => {\n    const profileData = React.useContext(ProfileContext);`);
});

content = content.replace(/const StandardBaseInfo = \(\{ theme \}: \{ theme: string \}\) => \{/g, 
    "export const StandardBaseInfo = ({ theme }: { theme: string }) => {\n    const profileData = React.useContext(ProfileContext);");

fs.writeFileSync('src/components/DigitalCard08Themes.tsx', content);
console.log("Fixed again");
