export const weeklyData = [
  {
    day: "Даваа",
    hours: 8,
    time: "09:00-17:00",
    tasks: [
      {
        type: "move",
        time: "09:00",
        action: "Хүлээн авах",
        product: "Кока-Кола",
        quantity: 60,
        from: "Хүлээн авах бүс",
        to: "Тавиур A1",
        shelf: "A1-3",
      },
      {
        type: "message",
        time: "10:30",
        action: "Менежерийн заавар",
        message:
          "Өглөөний ирсэн барааг эхлээд A бүсэд байршуулна. Хүнд хайрцгуудыг хоёр хүнтэй зөөнө.",
      },
      {
        type: "move",
        time: "14:00",
        action: "Дахин байршуулах",
        product: "Чипс",
        quantity: 40,
        from: "Түр хадгалах бүс",
        to: "Тавиур B1",
        shelf: "B1-2",
      },
    ],
    reminders: ["Өдрийн тайлан менежерт илгээх"],
  },

  {
    day: "Мягмар",
    hours: 6,
    time: "10:00-16:00",
    tasks: [
      {
        type: "move",
        time: "10:00",
        action: "Нөөц шалгах",
        product: "Содтой ундаа",
        quantity: 80,
        from: "A2",
        to: "Сток систем",
        shelf: "SYS-1",
      },
      {
        type: "message",
        time: "12:00",
        action: "Менежерийн сануулга",
        message:
          "Өнөөдөр системийн бүртгэл шалгана. Бүх scan хийсэн барааг давхар шалгаарай.",
      },
    ],
    reminders: [],
  },

  {
    day: "Лхагва",
    hours: 9,
    time: "08:00-17:00",
    tasks: [
      {
        type: "move",
        time: "08:00",
        action: "Захиалга бэлтгэх",
        product: "Төрөл бүрийн бараа",
        quantity: 200,
        from: "A бүс",
        to: "Гаргалгааны бүс",
        shelf: "PACK-1",
      },
      {
        type: "move",
        time: "11:00",
        action: "Агуулах цэвэрлэх",
        product: "—",
        quantity: 0,
        from: "B бүс",
        to: "B бүс",
        shelf: "ALL",
      },
      {
        type: "message",
        time: "15:00",
        action: "Meeting reminder",
        message: "15:00 цагт менежертэй өдөр тутмын уулзалт.",
      },
    ],
    reminders: ["15:00 meeting"],
  },

  {
    day: "Пүрэв",
    hours: 7,
    time: "09:00-16:00",
    tasks: [
      {
        type: "move",
        time: "09:00",
        action: "Нөөц шалгах",
        product: "Шоколад",
        quantity: 70,
        from: "A3",
        to: "Сток систем",
        shelf: "A3-1",
      },
      {
        type: "move",
        time: "12:00",
        action: "Дахин байршуулах",
        product: "Snack багц",
        quantity: 45,
        from: "A2",
        to: "B2",
        shelf: "B2-1",
      },
    ],
    reminders: [],
  },

  {
    day: "Баасан",
    hours: 8,
    time: "09:00-17:00",
    tasks: [
      {
        type: "move",
        time: "09:00",
        action: "Шинэ бараа байршуулах",
        product: "Импортын бараа",
        quantity: 150,
        from: "Хүлээн авах бүс",
        to: "Тавиур C1",
        shelf: "C1-4",
      },
      {
        type: "message",
        time: "13:00",
        action: "Системийн шинэчлэл",
        message:
          "Бүх барааны бүртгэлийг шинэчлэх. Scan алдаатай барааг дахин шалгана.",
      },
      {
        type: "move",
        time: "16:00",
        action: "Weekly report бэлтгэх",
        product: "Бүх бараа",
        quantity: 300,
        from: "Warehouse",
        to: "Manager",
        shelf: "OFFICE",
      },
    ],
    reminders: ["Weekly report илгээх"],
  },

  {
    day: "Бямба",
    hours: 5,
    time: "10:00-15:00",
    tasks: [
      {
        type: "move",
        time: "10:00",
        action: "Цэгцлэлт",
        product: "Жижиг бараа",
        quantity: 90,
        from: "A бүс",
        to: "A бүс",
        shelf: "A1-A3",
      },
      {
        type: "message",
        time: "12:00",
        action: "Сануулах",
        message:
          "Амралтын өдөр тул хурдан бөгөөд хөнгөн ажлууд хийнэ. Хэт ачаалалгүй ажиллана.",
      },
    ],
    reminders: [],
  },

  {
    day: "Ням",
    hours: 0,
    time: "Амралт",
    tasks: [],
    reminders: [],
  },
]