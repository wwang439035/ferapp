import React, { Component } from "react";
import { ResponsiveContainer, PieChart, Pie } from "recharts";

class SummaryPieChart extends Component{
    formatData() {
        const {
            angry,
            sad,
            happy,
            neutral,
            surprise,
            disgust,
        } = this.props;
        let data = [
            {
                name: "happy",
                value: happy
            },
            {
                name: "sad",
                value: sad
            },
            {
                name: "angry",
                value: angry
            },
            {
                name: "neutral",
                value: neutral
            },
            {
                name: "surprise",
                value: surprise
            },
            {
                name: "disgust",
                value: disgust
            },
        ];
        return data;
    }
    render() {
        const data = this.formatData();
        return <ResponsiveContainer width="100%" height={250}>
            <PieChart height={250}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                value,
                                index
                            }) => {
                        console.log("handling label?");
                        const RADIAN = Math.PI / 180;
                        // eslint-disable-next-line
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        // eslint-disable-next-line
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        // eslint-disable-next-line
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                                x={x}
                                y={y}
                                fill="#8884d8"
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                            >
                                {data[index].name} ({value})
                            </text>
                        );
                    }}
                />
            </PieChart>
        </ResponsiveContainer>;
    }
}

export default SummaryPieChart;
