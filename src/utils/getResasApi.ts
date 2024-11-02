export const getPrefectures = async () => {
  const url = "http://localhost:3000/api/prefectures";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("データの取得に失敗しました:", error);
    throw error;
  }
};

export const getPopulationPerYear = async (id: number) => {
  const url = `http://localhost:3000/api/population?perYear=${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("データの取得に失敗しました:", error);
    throw error;
  }
};
