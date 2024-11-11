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
  const [dataTypeIndex, setDataTypeIndex] = useState(0);

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
      const updatedPopulationData: PopulationData[] = [...INITIAL_YEARS];

      try {
        for (const prefCode of selectedPrefectures) {
          const population = await getPopulationPerYear(prefCode);
          console.log(population);
          population.result.data[dataTypeIndex].data.forEach((item: { year: number; value: number }, index: number) => {
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
  }, [selectedPrefectures, dataTypeIndex]);

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
        <div className="w-full text-center text-2xl font-semibold mb-4">
          {dataTypeIndex === 0 && "総人口推移"}
          {dataTypeIndex === 1 && "年少人口推移"}
          {dataTypeIndex === 2 && "生産年齢人口推移"}
          {dataTypeIndex === 3 && "老年人口推移"}
        </div>
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
        <div className="flex justify-center gap-5">
          <button onClick={() => setDataTypeIndex(0)} className={`rounded-[4px] font-semibold text-white px-4 py-2 transition-colors duration-200 ${dataTypeIndex === 0 ? "bg-[#2d716d]" : "bg-[rgba(0,164,150,1)] hover:bg-[#50d7cc]"}`}>
            総人口
          </button>
          <button onClick={() => setDataTypeIndex(1)} className={`rounded-[4px] font-semibold text-white px-4 py-2 transition-colors duration-200 ${dataTypeIndex === 1 ? "bg-[#2d716d]" : "bg-[rgba(0,164,150,1)] hover:bg-[#50d7cc]"}`}>
            年少人口
          </button>
          <button onClick={() => setDataTypeIndex(2)} className={`rounded-[4px] font-semibold text-white px-4 py-2 transition-colors duration-200 ${dataTypeIndex === 2 ? "bg-[#2d716d]" : "bg-[rgba(0,164,150,1)] hover:bg-[#50d7cc]"}`}>
            生産年齢人口
          </button>
          <button onClick={() => setDataTypeIndex(3)} className={`rounded-[4px] font-semibold text-white px-4 py-2 transition-colors duration-200 ${dataTypeIndex === 3 ? "bg-[#2d716d]" : "bg-[rgba(0,164,150,1)] hover:bg-[#50d7cc]"}`}>
            老年人口
          </button>
        </div>
      </div>
    </>
  );
};
