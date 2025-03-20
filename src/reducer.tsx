export const initialState = {
  data: [
    {
      id: 1,
      budget: 100,
      description: "Kıyafet satışı",
      earning: "KAZANÇ",
      date: "12.10.2024",
    },
    {
      id: 2,
      budget: 200,
      description: "Yemek alma",
      spending: "HARCAMA",
      date: "04.02.2025",
    },
    {
      id: 3,
      budget: 50,
      description: "Kitap satışı",
      earning: "KAZANÇ",
      date: "20.03.2024",
    },
    {
      id: 4,
      budget: 500,
      description: "Telefon alımı",
      spending: "HARCAMA",
      date: "15.07.2025",
    },
    {
      id: 5,
      budget: 300,
      description: "Freelance yazılım geliştirme",
      earning: "KAZANÇ",
      date: "08.09.2024",
    },
    {
      id: 6,
      budget: 150,
      description: "Elektrik faturası",
      spending: "HARCAMA",
      date: "30.01.2025",
    },
    {
      id: 7,
      budget: 250,
      description: "İkinci el bilgisayar satışı",
      earning: "KAZANÇ",
      date: "22.11.2024",
    },
    {
      id: 8,
      budget: 90,
      description: "Market alışverişi",
      spending: "HARCAMA",
      date: "10.05.2025",
    },
    {
      id: 9,
      budget: 700,
      description: "Web sitesi tasarlama",
      earning: "KAZANÇ",
      date: "18.08.2024",
    },
    {
      id: 10,
      budget: 120,
      description: "Sinema bileti",
      spending: "HARCAMA",
      date: "05.06.2025",
    },
    {
      id: 11,
      budget: 400,
      description: "Araba parçaları satışı",
      earning: "KAZANÇ",
      date: "02.12.2024",
    },
    {
      id: 12,
      budget: 80,
      description: "Kahve içme",
      spending: "HARCAMA",
      date: "25.03.2025",
    },
    {
      id: 13,
      budget: 600,
      description: "Mobil uygulama geliştirme",
      earning: "KAZANÇ",
      date: "14.09.2024",
    },
    {
      id: 14,
      budget: 130,
      description: "Taksi ücreti",
      spending: "HARCAMA",
      date: "07.04.2025",
    },
    {
      id: 15,
      budget: 350,
      description: "Eğitim kursu satışı",
      earning: "KAZANÇ",
      date: "19.07.2024",
    },
  ],
  user: null,
};

export const getSpendingTotal = (data: any[]) => {
  return data
    .filter((item) => item.spending === "HARCAMA")
    .reduce((total, item) => total + item.budget, 0);
};

export const getEarningTotal = (data: any[]) => {
  return data
    .filter((item) => item.earning === "KAZANÇ")
    .reduce((total, item) => total + item.budget, 0);
};

const reducer = (
  state: { user: any; data: Array<any> },
  action: { type: any; item: any; data?: any; id?: any }
) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.item,
      };
    // case "SET_DATA":
    //   return {
    //     ...state,
    //     data: action.data.filter((item: any) => item.userId === state.user.id),
    //   };
    case "ADD_DATA":
      console.log("Eklenen veri:", action.item);
      return {
        ...state,
        data: [...state.data, action.item],
      };
    case "REMOVE_DATA":
      return {
        ...state,
        data: state.data.filter((item) => item.id !== action.id),
      };
    case "UPDATE_DATA":
      return {
        ...state,
        data: state.data.map((data) =>
          data.id === action.data.id ? { ...data, ...action.data } : data
        ),
      };
    default:
      return state;
  }
};

export default reducer;
