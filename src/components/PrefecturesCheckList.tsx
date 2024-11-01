"use client";

import { getPrefecturesetPrefectures } from "@/utils/getResasApi";
import React, { useEffect } from "react";

export const PrefecturesCheckList = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPrefecturesetPrefectures();
        console.log(result);
      } catch (error) {
        console.error("Error fetching prefectures:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap max-w-md mx-auto mt-4">
      <h2 className="w-full text-center text-2xl font-semibold mb-4">都道府県</h2>
    </div>
  );
};
