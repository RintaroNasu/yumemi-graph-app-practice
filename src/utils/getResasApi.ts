const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getPrefectures = async () => {
  const url = `${baseUrl}/api/prefectures`;
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
  const url = `${baseUrl}/api/population?perYear=${id}`;
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
