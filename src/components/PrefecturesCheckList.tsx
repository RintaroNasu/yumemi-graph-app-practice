"use client";

import { getPrefecturesetPrefectures } from "@/utils/getResasApi";
import { useEffect, useState } from "react";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

export const PrefecturesCheckList = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrefecturesetPrefectures();
        setPrefectures(data.result);
      } catch (error) {
        console.error("Error fetching prefectures:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap max-w-7xl mx-auto mt-4  rounded-lg bg-gray-50 p-5 shadow-lg">
      <h2 className="w-full text-center text-2xl font-semibold mb-4">都道府県</h2>
      {prefectures.map((prefecture, index) => (
        <div key={index} className="flex items-center w-1/12 p-2">
          <input type="checkbox" id={`pref-${prefecture.prefCode}`} className="mr-2" />
          <label htmlFor={`pref-${prefecture.prefCode}`}>{prefecture.prefName}</label>
        </div>
      ))}
    </div>
  );
};
