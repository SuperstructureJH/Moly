const fs = require('fs');
let content = fs.readFileSync('src/components/DigitalCard08Themes.tsx', 'utf8');

// 1. Add ProfileContext definition at the top
if (!content.includes('ProfileContext')) {
    content = content.replace(
        "import { useNavigate } from 'react-router-dom';",
        "import { useNavigate } from 'react-router-dom';\nexport const ProfileContext = React.createContext<any>(null);"
    );
}

// 2. Fix Arrow functions with implicit return: `export const HeroBase = () => (`
// -> `export const HeroBase = () => { const profileData = React.useContext(ProfileContext); return (`
content = content.replace(/export const ([a-zA-Z0-9_]+) = \(\) => \(/g, 
    "export const $1 = () => {\n    const profileData = React.useContext(ProfileContext);\n    return (");
// close the return parenthesis for these
content = content.replace(/^(\s*)\);\n\n\/\//gm, "$1);\n};\n\n//");
// Fix HeroWood specifically
content = content.replace(/    <\/div>\n\);\n\n\/\/ 4. Water/g, "    </div>\n);\n};\n\n// 4. Water");
// Fix HeroWater specifically
content = content.replace(/    <\/div>\n\);\n\n\/\/ 5. Fire/g, "    </div>\n);\n};\n\n// 5. Fire");
// Fix HeroFire specifically
content = content.replace(/    <\/div>\n\);\n\n\/\/ 6. Earth/g, "    </div>\n);\n};\n\n// 6. Earth");
// Fix HeroEarth specifically
content = content.replace(/    <\/div>\n\);\n\n\/\/ BaseInfoFire/g, "    </div>\n);\n};\n\n// BaseInfoFire");
// Fix BaseInfoFire specifically
content = content.replace(/    <\/div>\n\);\n\n\/\/ Components end/g, "    </div>\n);\n};\n\n// Components end");

// 3. Fix standard block functions: `export const BaseInfoWater = () => {`
content = content.replace(/export const ([a-zA-Z0-9_]+) = \(\) => \{/g, 
    "export const $1 = () => {\n    const profileData = React.useContext(ProfileContext);");

// 4. Fix properties in components that already have arguments e.g. StandardBaseInfo
content = content.replace(/export const StandardBaseInfo = \(\{ theme, profileData \}: \{ theme: string, profileData: any \}\) => \{/g, 
    "export const StandardBaseInfo = ({ theme }: { theme: string }) => {\n    const profileData = React.useContext(ProfileContext);");

content = content.replace(/export const StandardBaseInfo = \(\{ theme \}: \{ theme: string \}\) => \{/g, 
    "export const StandardBaseInfo = ({ theme }: { theme: string }) => {\n    const profileData = React.useContext(ProfileContext);");

// Same for the props that were injected before:
content = content.replace(/export const ([a-zA-Z0-9_]+) = \(\{ profileData \}: \{ profileData: any \}\) => \{/g, 
    "export const $1 = () => {\n    const profileData = React.useContext(ProfileContext);");
content = content.replace(/export const ([a-zA-Z0-9_]+) = \(\{ profileData \}: \{ profileData: any \}\) => \(/g, 
    "export const $1 = () => {\n    const profileData = React.useContext(ProfileContext);\n    return (");

// Remove profileData={profileData} props passed internally
content = content.replace(/ profileData=\{profileData\}/g, '');

fs.writeFileSync('src/components/DigitalCard08Themes.tsx', content);
console.log("Processed DigitalCard08Themes.tsx");
