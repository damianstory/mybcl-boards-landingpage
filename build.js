#!/usr/bin/env node

/**
 * myBlueprint Career Launch - Production Build Script
 * Optimizes files for production deployment
 */

const fs = require('fs');
const path = require('path');

class BuildOptimizer {
    constructor() {
        this.buildDir = 'dist';
        this.sourceDir = '.';
        this.startTime = Date.now();
    }

    async build() {
        console.log('🚀 Building myBlueprint Career Launch Landing Page...\n');

        try {
            // Clean build directory
            await this.cleanBuildDir();
            
            // Create build directory structure
            await this.createBuildStructure();
            
            // Copy and optimize files
            await this.copyStaticFiles();
            await this.optimizeHTML();
            await this.optimizeCSS();
            await this.optimizeJS();
            
            // Generate production config
            await this.generateProductionConfig();
            
            const buildTime = Date.now() - this.startTime;
            console.log(`✅ Build completed successfully in ${buildTime}ms`);
            console.log(`📦 Production files are in the '${this.buildDir}' directory`);
            
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    }

    async cleanBuildDir() {
        console.log('🧹 Cleaning build directory...');
        
        if (fs.existsSync(this.buildDir)) {
            fs.rmSync(this.buildDir, { recursive: true, force: true });
        }
    }

    async createBuildStructure() {
        console.log('📁 Creating build structure...');
        
        const dirs = [
            this.buildDir,
            `${this.buildDir}/styles`,
            `${this.buildDir}/js`,
            `${this.buildDir}/images`,
            `${this.buildDir}/fonts`
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async copyStaticFiles() {
        console.log('📋 Copying static files...');
        
        // Copy images recursively
        this.copyDirectory('images', path.join(this.buildDir, 'images'));

        // Copy package.json
        fs.copyFileSync('package.json', path.join(this.buildDir, 'package.json'));
        
        // Copy component directories to build
        if (fs.existsSync('components')) {
            this.copyDirectory('components', path.join(this.buildDir, 'components'));
        }
    }

    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const items = fs.readdirSync(src);
        items.forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            
            const stat = fs.statSync(srcPath);
            if (stat.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    async optimizeHTML() {
        console.log('📄 Optimizing HTML and assembling components...');
        
        let html = fs.readFileSync('index.html', 'utf8');
        
        // Assemble components into main HTML
        html = await this.assembleComponents(html);

        // Minify HTML (basic optimization)
        html = html
            // Remove comments
            .replace(/<!--[\s\S]*?-->/g, '')
            // Remove extra whitespace between tags
            .replace(/>\s+</g, '><')
            // Remove leading/trailing whitespace
            .trim();

        // Update paths for production
        html = html.replace(
            'url(\'images/bg-enhanced.svg\')',
            'url(\'images/bg-hero.webp\'), url(\'images/bg-hero.jpg\')'
        );

        // Add cache-busting for assets
        const timestamp = Date.now();
        html = html
            .replace(/href="styles\//g, `href="styles/`)
            .replace(/src="js\//g, `src="js/`)
            .replace(/globals\.css"/g, `globals.css?v=${timestamp}"`)
            .replace(/main\.css"/g, `main.css?v=${timestamp}"`)
            .replace(/responsive\.css"/g, `responsive.css?v=${timestamp}"`)
            .replace(/main\.js"/g, `main.js?v=${timestamp}"`)
            .replace(/validation\.js"/g, `validation.js?v=${timestamp}"`);

        fs.writeFileSync(path.join(this.buildDir, 'index.html'), html);
    }
    
    async assembleComponents(html) {
        // This would be where component assembly happens
        // For now, we'll keep the existing HTML structure
        // but this method allows for future component assembly
        
        console.log('  - Keeping existing component structure in HTML');
        return html;
    }

    async optimizeCSS() {
        console.log('🎨 Optimizing CSS and combining components...');
        
        // Combine component CSS files
        let combinedCSS = '';
        
        // Start with global styles
        if (fs.existsSync('styles/globals.css')) {
            console.log('  - Adding globals.css');
            combinedCSS += fs.readFileSync('styles/globals.css', 'utf8') + '\n\n';
        }
        
        // Add component styles
        const componentCSS = [
            'styles/components/slider.css',
            'styles/components/hero.css',
            'styles/components/bento.css',
            'styles/components/footer.css'
        ];
        
        componentCSS.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                console.log(`  - Adding ${cssFile}`);
                const content = fs.readFileSync(cssFile, 'utf8');
                combinedCSS += `/* ${cssFile} */\n${content}\n\n`;
            }
        });
        
        // Add legacy main.css and responsive.css if they exist
        if (fs.existsSync('styles/main.css')) {
            console.log('  - Adding remaining main.css styles');
            const mainCSS = fs.readFileSync('styles/main.css', 'utf8');
            combinedCSS += `/* Legacy main.css */\n${mainCSS}\n\n`;
        }
        
        if (fs.existsSync('styles/responsive.css')) {
            console.log('  - Adding remaining responsive.css styles');
            const responsiveCSS = fs.readFileSync('styles/responsive.css', 'utf8');
            combinedCSS += `/* Legacy responsive.css */\n${responsiveCSS}\n\n`;
        }
        
        // Update background image paths for production
        combinedCSS = combinedCSS.replace(
            /url\(['"]?\.\.\/images\/bg-enhanced\.svg['"]?\)/g,
            'url(\'../images/bg-hero.webp\')'
        );
        
        // Minify combined CSS
        const minifiedCSS = this.minifyCSS(combinedCSS);
        
        // Write the combined CSS file
        fs.writeFileSync(path.join(this.buildDir, 'styles', 'main.css'), minifiedCSS);
        
        // Also write globals.css separately for development
        if (fs.existsSync('styles/globals.css')) {
            const globalsCSS = this.minifyCSS(fs.readFileSync('styles/globals.css', 'utf8'));
            fs.writeFileSync(path.join(this.buildDir, 'styles', 'globals.css'), globalsCSS);
        }
    }

    async optimizeJS() {
        console.log('⚡ Optimizing JavaScript and combining components...');
        
        // Copy component JS files to build/js/components
        if (!fs.existsSync(path.join(this.buildDir, 'js', 'components'))) {
            fs.mkdirSync(path.join(this.buildDir, 'js', 'components'), { recursive: true });
        }
        
        // Component JS files
        const componentJS = [
            'js/components/slider.js',
            'js/components/hero.js',
            'js/components/bento.js',
            'js/components/footer.js'
        ];
        
        componentJS.forEach(jsFile => {
            if (fs.existsSync(jsFile)) {
                console.log(`  - Optimizing ${jsFile}`);
                let content = fs.readFileSync(jsFile, 'utf8');
                
                // Replace development config with production config
                content = content.replace(
                    'process.env.ZOHO_ENDPOINT || \'https://api.zoho.com/crm/v2/Leads\'',
                    '\'https://www.zohoapis.com/crm/v2/Leads\''
                );
                
                const minified = this.minifyJS(content);
                const outputPath = path.join(this.buildDir, jsFile);
                fs.writeFileSync(outputPath, minified);
            }
        });
        
        // Optimize validation.js
        if (fs.existsSync('js/validation.js')) {
            console.log('  - Optimizing validation.js');
            let validationJS = fs.readFileSync('js/validation.js', 'utf8');
            validationJS = this.minifyJS(validationJS);
            fs.writeFileSync(path.join(this.buildDir, 'js', 'validation.js'), validationJS);
        }

        // Optimize main.js and inject production config
        if (fs.existsSync('js/main.js')) {
            console.log('  - Optimizing main.js');
            let mainJS = fs.readFileSync('js/main.js', 'utf8');
            
            // Replace development config with production config
            mainJS = mainJS.replace(
                'process.env.ZOHO_ENDPOINT || \'https://api.zoho.com/crm/v2/Leads\'',
                '\'https://www.zohoapis.com/crm/v2/Leads\''
            );
            
            mainJS = this.minifyJS(mainJS);
            fs.writeFileSync(path.join(this.buildDir, 'js', 'main.js'), mainJS);
        }
    }

    minifyCSS(css) {
        return css
            // Remove comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace
            .replace(/\s+/g, ' ')
            // Remove spaces around certain characters
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            // Remove trailing semicolons before }
            .replace(/;}/g, '}')
            .trim();
    }

    minifyJS(js) {
        return js
            // Remove single-line comments (but preserve URLs)
            .replace(/\/\/(?![^\n]*:\/\/).*$/gm, '')
            // Remove multi-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace (basic)
            .replace(/\s+/g, ' ')
            .trim();
    }

    async generateProductionConfig() {
        console.log('⚙️  Generating production configuration...');

        const config = {
            name: 'myBlueprint Career Launch Landing Page',
            version: '1.0.0',
            build: {
                timestamp: new Date().toISOString(),
                environment: 'production'
            },
            performance: {
                target_load_time: '2000ms',
                target_conversion: '25%'
            },
            integrations: {
                zoho_crm: true,
                analytics: false
            }
        };

        fs.writeFileSync(
            path.join(this.buildDir, 'build-info.json'),
            JSON.stringify(config, null, 2)
        );
    }
}

// Run build if called directly
if (require.main === module) {
    const builder = new BuildOptimizer();
    builder.build();
}

module.exports = BuildOptimizer;