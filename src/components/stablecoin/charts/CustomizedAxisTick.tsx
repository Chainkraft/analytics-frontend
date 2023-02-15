const CustomizedAxisTick = (props: any) => {
    return (
        <g transform={`translate(${props.x},${props.y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill={props.stroke} transform="rotate(-35)">
                {props.payload.value}
            </text>
        </g>
    );
}

export default CustomizedAxisTick;
