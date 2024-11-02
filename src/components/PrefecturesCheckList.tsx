"use client";

import { getPopulationPerYear, getPrefectures } from "@/utils/getResasApi";
import { useEffect, useState } from "react";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

export const PrefecturesCheckList = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<Set<number>>(new Set());

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
      }
      return newSelected;
    });
  };

  useEffect(() => {
    const fetchPopulationData = async () => {
      try {
        for (const prefCode of selectedPrefectures) {
          const population = await getPopulationPerYear(prefCode);
          console.log(`prefCode=${prefCode}:`, population);
        }
      } catch (error) {
        console.error("Error fetching population data:", error);
      }
    };
    if (selectedPrefectures.size > 0) {
      fetchPopulationData();
    }
  }, [selectedPrefectures]);

  return (
    <div className="flex flex-wrap max-w-7xl mx-auto mt-4  rounded-lg bg-gray-50 p-5 shadow-lg">
      <h2 className="w-full text-center text-2xl font-semibold mb-4">都道府県</h2>
      {prefectures.map((prefecture, index) => (
        <div key={index} className="flex items-center w-1/12 p-2">
          <input type="checkbox" id={`pref-${prefecture.prefCode}`} className="mr-2" onChange={() => handleCheckboxChange(prefecture.prefCode)} />
          <label htmlFor={`pref-${prefecture.prefCode}`}>{prefecture.prefName}</label>
        </div>
      ))}
    </div>
  );
};
