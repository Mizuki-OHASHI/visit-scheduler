// https://chouseisan.com/schedule/List/createCsv?h=6bad9422daac4beda8cfad35583db3a0&charset=utf-8&row=member

import { ChouseisanId } from "@/schema/visit-schedule";

export const fetchChouseisanCsv = async (chouseisanId: ChouseisanId) => {
  const url = `/proxy/chouseisan/schedule/List/createCsv?h=${chouseisanId}&charset=utf-8&row=member`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/csv",
    },
    redirect: "follow",
    credentials: "include",
  });
  return res.text();
};

// https://chouseisan.com/schedule/List/createCsv?h=6bad9422daac4beda8cfad35583db3a0&charset=utf-8&row=member
