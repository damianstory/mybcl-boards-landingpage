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
        console.log('📄 Optimizing HTML...');
        
        let html = fs.readFileSync('index.html', 'utf8');

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
            'url(\'images/bg-placeholder.svg\')',
            'url(\'images/bg-hero.webp\'), url(\'images/bg-hero.jpg\')'
        );

        // Add cache-busting for assets
        const timestamp = Date.now();
        html = html
            .replace(/href="styles\//g, `href="styles/`)
            .replace(/src="js\//g, `src="js/`)
            .replace(/main\.css"/g, `main.css?v=${timestamp}"`)
            .replace(/responsive\.css"/g, `responsive.css?v=${timestamp}"`)
            .replace(/main\.js"/g, `main.js?v=${timestamp}"`)
            .replace(/validation\.js"/g, `validation.js?v=${timestamp}"`);

        fs.writeFileSync(path.join(this.buildDir, 'index.html'), html);
    }

    async optimizeCSS() {
        console.log('🎨 Optimizing CSS...');
        
        // Optimize main.css
        let mainCSS = fs.readFileSync('styles/main.css', 'utf8');
        mainCSS = this.minifyCSS(mainCSS);
        
        // Update background image paths for production
        mainCSS = mainCSS.replace(
            'url(\'../images/bg-placeholder.svg\')',
            'url(\'../images/bg-hero.webp\')'
        );

        // Optimize responsive.css
        let responsiveCSS = fs.readFileSync('styles/responsive.css', 'utf8');
        responsiveCSS = this.minifyCSS(responsiveCSS);

        fs.writeFileSync(path.join(this.buildDir, 'styles', 'main.css'), mainCSS);
        fs.writeFileSync(path.join(this.buildDir, 'styles', 'responsive.css'), responsiveCSS);
    }

    async optimizeJS() {
        console.log('⚡ Optimizing JavaScript...');
        
        // Optimize validation.js
        let validationJS = fs.readFileSync('js/validation.js', 'utf8');
        validationJS = this.minifyJS(validationJS);

        // Optimize main.js and inject production config
        let mainJS = fs.readFileSync('js/main.js', 'utf8');
        
        // Replace development config with production config
        mainJS = mainJS.replace(
            'process.env.ZOHO_ENDPOINT || \'https://api.zoho.com/crm/v2/Leads\'',
            '\'https://www.zohoapis.com/crm/v2/Leads\''
        );
        
        mainJS = this.minifyJS(mainJS);

        fs.writeFileSync(path.join(this.buildDir, 'js', 'validation.js'), validationJS);
        fs.writeFileSync(path.join(this.buildDir, 'js', 'main.js'), mainJS);
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