"use client";

import { getPopulationPerYear, getPrefectures } from "@/utils/getResasApi";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type PopulationData = {
  year: number;
  [prefCode: string]: number;
};

const INITIAL_YEARS = Array.from({ length: 18 }, (_, i) => ({ year: 1960 + i * 5 }));

export const PrefecturesCheckList = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<Set<number>>(new Set());
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [colorMap, setColorMap] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prefecture = await getPrefectures();
        setPrefectures(prefecture.result);
      } catch (error) {
        console.error("Error fetching prefectures:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = async (prefCode: number) => {
    setSelectedPrefectures((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(prefCode)) {
        newSelected.delete(prefCode);
      } else {
        newSelected.add(prefCode);
        if (!colorMap[prefCode]) {
          setColorMap((prevColorMap) => ({
            ...prevColorMap,
            [prefCode]: `#${Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")}`,
          }));
        }
      }
      return newSelected;
    });
  };

  useEffect(() => {
    const fetchPopulationData = async () => {
      const updatedPopulationData: PopulationData[] = [...populationData];

      try {
        for (const prefCode of selectedPrefectures) {
          const population = await getPopulationPerYear(prefCode);
          population.result.data[0].data.forEach((item: any, index: number) => {
            if (!updatedPopulationData[index]) {
              updatedPopulationData[index] = { year: item.year };
            }
            updatedPopulationData[index][prefCode] = item.value;
          });
        }
        setPopulationData(updatedPopulationData);
      } catch (error) {
        console.error("Error fetching population data:", error);
      }
    };
    if (selectedPrefectures.size > 0) {
      fetchPopulationData();
    } else {
      setPopulationData(INITIAL_YEARS);
    }
  }, [selectedPrefectures]);

  return (
    <>
      <div className="flex flex-wrap max-w-7xl mx-auto mt-4  rounded-lg bg-gray-50 p-5 shadow-lg">
        <h2 className="w-full text-center text-2xl font-semibold mb-4">都道府県</h2>
        {prefectures.map((prefecture, index) => (
          <div key={index} className="flex items-center w-1/12 p-2">
            <input type="checkbox" id={`pref-${prefecture.prefCode}`} className="mr-2" onChange={() => handleCheckboxChange(prefecture.prefCode)} />
            <label htmlFor={`pref-${prefecture.prefCode}`}>{prefecture.prefName}</label>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={populationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "年", position: "insideBottomRight", offset: -10 }} />
            <YAxis label={{ value: "人口数", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            {Array.from(selectedPrefectures).map((prefCode) => (
              <Line key={prefCode} type="monotone" dataKey={prefCode} name={prefectures.find((pref) => pref.prefCode === prefCode)?.prefName} stroke={colorMap[prefCode]} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
