import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        const vsSource = `
            attribute vec4 aVertexPosition;
            varying vec2 vUv;
            void main() {
                gl_Position = aVertexPosition;
                vUv = aVertexPosition.xy * 0.5 + 0.5;
            }
        `;

        const fsSource = `
            precision highp float;
            varying vec2 vUv;
            uniform float uTime;
            uniform vec2 uResolution;

            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v){
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod(i, 289.0);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 st = gl_FragCoord.xy / uResolution.xy;
                st.x *= uResolution.x / uResolution.y;
                float t = uTime * 0.2;

                float n = snoise(st * 1.5 - vec2(0.0, t)) * 0.5 + 0.5;
                n += snoise(st * 3.0 + vec2(t*0.5, 0.0)) * 0.25;
                
                vec2 centerL = vec2(0.2, 0.7);
                vec2 centerR = vec2(0.8, 0.6);
                
                float distL = distance(st, centerL);
                float distR = distance(st, centerR);
                
                float blobL = smoothstep(0.8, 0.1, distL + n*0.3);
                float blobR = smoothstep(0.9, 0.1, distR + n*0.4);
                
                float density = max(blobL, blobR);
                density = mix(density, smoothstep(0.1, 0.8, st.y + n*0.2), 0.5);
                
                density *= smoothstep(-0.1, 0.5, gl_FragCoord.y / uResolution.y);

                vec3 colWhite = vec3(0.98, 0.98, 0.99); 
                vec3 colBlue = vec3(0.07, 0.10, 0.90);  
                
                float mixFactor = smoothstep(0.2, 0.7, density + (n * 0.1));
                vec3 finalColor = mix(colWhite, colBlue, mixFactor);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const positions = new Float32Array([
            -1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
             1.0, -1.0,
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'aVertexPosition');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, 'uTime');
        const resolutionLocation = gl.getUniformLocation(program, 'uResolution');

        function resizeCanvas() {
            if (!canvas) return;
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        }

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }
        
        resizeCanvas();

        let startTime = Date.now();
        let animationFrameId: number;

        function render() {
            const currentTime = (Date.now() - startTime) / 1000.0;
            gl.uniform1f(timeLocation, currentTime);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        }

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full z-0 opacity-90"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default FluidBackground;
