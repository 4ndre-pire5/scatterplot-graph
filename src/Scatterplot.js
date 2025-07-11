import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'; // Importa todas as funcionalidades do D3.js

const Scatterplot = ({ data, width = 800, height = 600 }) => {

    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Limpa o SVG antes de desenhar, útil para atualizações
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 60, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const parsedData = data.map(d => {
            const timeParts = d.time.split(':');
            const minutes = parseInt(timeParts[0]);
            const seconds = parseInt(timeParts[1]);
            return {
                ...d,
                year: +d.year,
                timeInSeconds: minutes * 60 + seconds
            };
        });

        const xScale = d3.scaleLinear()
            .domain([d3.min(parsedData, d => d.year - 1), d3.max(parsedData, d => d.year + 1)])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(parsedData, d => d.timeInSeconds - 5), d3.max(parsedData, d => d.timeInSeconds + 5)])
            .range([0, innerHeight]);

        // Desenha o eixo X
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));

        g.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis)

        // Desenha o eixo Y
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d => {
                const minutes = Math.floor(d / 60);
                const seconds = d % 60;
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            });

        g.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)

        // Desenhas os pontos
        g.selectAll('.dot')
            .data(parsedData)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.timeInSeconds))
            .attr('r', 5)
            .attr('fill', d => d.doping ? 'red' : 'green')
            .attr('data-year', d => d.year)
            .attr('data-time', d => d.time)
            .attr('data-doping', d => d.doping);

    }, [data, width, height]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default Scatterplot;
