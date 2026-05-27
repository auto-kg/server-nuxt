import type { Car } from '../types/car'

const image = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

export const cars: Car[] = [
  {
    id: 'bmw-330i-2021',
    brand: 'BMW',
    model: '3 Series',
    title: 'BMW 330i xDrive M Sport',
    price: 32900,
    year: 2021,
    mileage: 38500,
    fuel: 'Бензин',
    transmission: 'Автомат',
    city: 'Бишкек',
    priceBadge: 'Top deal',
    images: [
      image('photo-1555215695-3004980ad54e'),
      image('photo-1603386329225-868f9b1ee6c9'),
      image('photo-1494976388531-d1058494cdd8')
    ],
    engine: '2.0 л TwinPower Turbo',
    drivetrain: 'Полный',
    power: 258,
    color: 'Mineral Grey',
    description:
      'Седан в комплектации M Sport с полным приводом, адаптивным круиз-контролем, матричной оптикой и сервисной историей у официального дилера. Салон без следов интенсивной эксплуатации.',
    seller: {
      name: 'Bishkek Auto Center',
      type: 'Дилер',
      rating: 4.8,
      phone: '+996 555 245 801',
      responseTime: 'обычно отвечает за 20 минут'
    },
    isFeatured: true
  },
  {
    id: 'audi-a4-2020',
    brand: 'Audi',
    model: 'A4',
    title: 'Audi A4 Avant 40 TDI S line',
    price: 28750,
    year: 2020,
    mileage: 64200,
    fuel: 'Дизель',
    transmission: 'Автомат',
    city: 'Ош',
    priceBadge: 'Хорошая цена',
    images: [
      image('photo-1605559424843-9e4c228bf1c2'),
      image('photo-1542362567-b07e54358753'),
      image('photo-1503736334956-4c8f8e92946d')
    ],
    engine: '2.0 л TDI',
    drivetrain: 'Передний',
    power: 204,
    color: 'Navarra Blue',
    description:
      'Практичный универсал с виртуальной приборной панелью, LED Matrix, камерой заднего вида и комплектом зимних колес. Автомобиль прошел предпродажную диагностику.',
    seller: {
      name: 'Osh Motors',
      type: 'Дилер',
      rating: 4.6,
      phone: '+996 700 771 429',
      responseTime: 'отвечает в течение часа'
    },
    isFeatured: true
  },
  {
    id: 'mercedes-c300-2022',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    title: 'Mercedes-Benz C 300 AMG Line',
    price: 41800,
    year: 2022,
    mileage: 21400,
    fuel: 'Гибрид',
    transmission: 'Автомат',
    city: 'Бишкек',
    priceBadge: 'Fair price',
    images: [
      image('photo-1619405399517-d7fce0f13302'),
      image('photo-1511919884226-fd3cad34687c'),
      image('photo-1525609004556-c46c7d6cf023')
    ],
    engine: '2.0 л mild hybrid',
    drivetrain: 'Задний',
    power: 258,
    color: 'Obsidian Black',
    description:
      'Свежий C-Class с пакетом AMG Line, панорамной крышей, Burmester, проекционным дисплеем и расширенными ассистентами. Один владелец, без ДТП.',
    seller: {
      name: 'Premium Bishkek',
      type: 'Дилер',
      rating: 4.9,
      phone: '+996 777 604 113',
      responseTime: 'обычно отвечает за 15 минут'
    },
    isFeatured: true
  },
  {
    id: 'tesla-model-3-2021',
    brand: 'Tesla',
    model: 'Model 3',
    title: 'Tesla Model 3 Long Range AWD',
    price: 35600,
    year: 2021,
    mileage: 47800,
    fuel: 'Электро',
    transmission: 'Автомат',
    city: 'Джалал-Абад',
    priceBadge: 'Top deal',
    images: [
      image('photo-1560958089-b8a1929cea89'),
      image('photo-1563720223185-11003d516935'),
      image('photo-1617704548623-340376564e68')
    ],
    engine: 'Dual Motor',
    drivetrain: 'Полный',
    power: 498,
    color: 'Pearl White',
    description:
      'Model 3 Long Range с полным приводом, тепловым насосом, Autopilot, свежей резиной и сохраненной гарантией на батарею. Заряжалась преимущественно дома.',
    seller: {
      name: 'Jalal-Abad EV Point',
      type: 'Дилер',
      rating: 4.7,
      phone: '+996 505 930 185',
      responseTime: 'отвечает сегодня'
    },
    isFeatured: true
  },
  {
    id: 'vw-golf-2021',
    brand: 'Volkswagen',
    model: 'Golf',
    title: 'Volkswagen Golf 1.5 eTSI Style',
    price: 22400,
    year: 2021,
    mileage: 52200,
    fuel: 'Гибрид',
    transmission: 'Робот',
    city: 'Каракол',
    priceBadge: 'Хорошая цена',
    images: [
      image('photo-1494905998402-395d579af36f'),
      image('photo-1541899481282-d53bffe3c35d'),
      image('photo-1580273916550-e323be2ae537')
    ],
    engine: '1.5 л eTSI',
    drivetrain: 'Передний',
    power: 150,
    color: 'Moonstone Grey',
    description:
      'Экономичный Golf с цифровой панелью, адаптивным круиз-контролем, подогревом сидений и Apple CarPlay. Хорошее состояние кузова и салона.',
    seller: {
      name: 'Issyk-Kul Auto',
      type: 'Дилер',
      rating: 4.5,
      phone: '+996 550 581 732',
      responseTime: 'отвечает в течение часа'
    },
    isFeatured: false
  },
  {
    id: 'porsche-macan-2020',
    brand: 'Porsche',
    model: 'Macan',
    title: 'Porsche Macan PDK',
    price: 53900,
    year: 2020,
    mileage: 33600,
    fuel: 'Бензин',
    transmission: 'Робот',
    city: 'Бишкек',
    priceBadge: 'Fair price',
    images: [
      image('photo-1503376780353-7e6692767b70'),
      image('photo-1503736334956-4c8f8e92946d'),
      image('photo-1511919884226-fd3cad34687c')
    ],
    engine: '2.0 л Turbo',
    drivetrain: 'Полный',
    power: 245,
    color: 'Carrara White',
    description:
      'Macan с PDK, Sport Chrono, вентиляцией сидений, BOSE и адаптивной подвеской. Обслуживание по регламенту, подтвержденный пробег.',
    seller: {
      name: 'Ala-Too Performance',
      type: 'Дилер',
      rating: 4.8,
      phone: '+996 999 392 661',
      responseTime: 'обычно отвечает за 30 минут'
    },
    isFeatured: true
  },
  {
    id: 'toyota-rav4-2022',
    brand: 'Toyota',
    model: 'RAV4',
    title: 'Toyota RAV4 Hybrid Executive',
    price: 37450,
    year: 2022,
    mileage: 28900,
    fuel: 'Гибрид',
    transmission: 'Автомат',
    city: 'Токмок',
    priceBadge: 'Top deal',
    images: [
      image('photo-1533473359331-0135ef1b58bf'),
      image('photo-1542362567-b07e54358753'),
      image('photo-1494976388531-d1058494cdd8')
    ],
    engine: '2.5 л Hybrid',
    drivetrain: 'Полный',
    power: 222,
    color: 'Silver Metallic',
    description:
      'Семейный кроссовер с полным гибридом, камерой 360, JBL, ассистентами Toyota Safety Sense и большим багажником. Отлично подходит для города и трассы.',
    seller: {
      name: 'Tokmok Mobility',
      type: 'Дилер',
      rating: 4.7,
      phone: '+996 706 834 291',
      responseTime: 'отвечает сегодня'
    },
    isFeatured: false
  },
  {
    id: 'skoda-octavia-2020',
    brand: 'Skoda',
    model: 'Octavia',
    title: 'Skoda Octavia Combi 2.0 TDI',
    price: 20900,
    year: 2020,
    mileage: 79500,
    fuel: 'Дизель',
    transmission: 'Автомат',
    city: 'Кант',
    priceBadge: 'Хорошая цена',
    images: [
      image('photo-1502877338535-766e1452684a'),
      image('photo-1552519507-da3b142c6e3d'),
      image('photo-1580273916550-e323be2ae537')
    ],
    engine: '2.0 л TDI',
    drivetrain: 'Передний',
    power: 150,
    color: 'Quartz Grey',
    description:
      'Просторный универсал с DSG, навигацией, подогревом руля, электроприводом багажника и низким расходом. Подходит для семьи и поездок.',
    seller: {
      name: 'Kant Carline',
      type: 'Дилер',
      rating: 4.4,
      phone: '+996 707 203 710',
      responseTime: 'отвечает в течение дня'
    },
    isFeatured: false
  },
  {
    id: 'hyundai-ioniq5-2023',
    brand: 'Hyundai',
    model: 'Ioniq 5',
    title: 'Hyundai Ioniq 5 77 kWh AWD',
    price: 46900,
    year: 2023,
    mileage: 11800,
    fuel: 'Электро',
    transmission: 'Автомат',
    city: 'Нарын',
    priceBadge: 'Fair price',
    images: [
      image('photo-1593941707882-a5bba14938c7'),
      image('photo-1617704548623-340376564e68'),
      image('photo-1563720223185-11003d516935')
    ],
    engine: '77 кВтч',
    drivetrain: 'Полный',
    power: 325,
    color: 'Digital Teal',
    description:
      'Электрокроссовер с быстрой зарядкой 800V, панорамной крышей, V2L, тепловым насосом и большим запасом хода. Практически новый автомобиль.',
    seller: {
      name: 'Naryn EV Store',
      type: 'Дилер',
      rating: 4.9,
      phone: '+996 500 688 427',
      responseTime: 'обычно отвечает за 10 минут'
    },
    isFeatured: true
  },
  {
    id: 'volvo-xc60-2021',
    brand: 'Volvo',
    model: 'XC60',
    title: 'Volvo XC60 B5 AWD Inscription',
    price: 39900,
    year: 2021,
    mileage: 44800,
    fuel: 'Гибрид',
    transmission: 'Автомат',
    city: 'Талас',
    priceBadge: 'Хорошая цена',
    images: [
      image('photo-1549924231-f129b911e442'),
      image('photo-1541899481282-d53bffe3c35d'),
      image('photo-1525609004556-c46c7d6cf023')
    ],
    engine: '2.0 л B5',
    drivetrain: 'Полный',
    power: 250,
    color: 'Denim Blue',
    description:
      'XC60 с кожаным салоном, Pilot Assist, Harman Kardon, четырехзонным климатом и полным приводом. Чистая история обслуживания.',
    seller: {
      name: 'Talas Motors',
      type: 'Дилер',
      rating: 4.6,
      phone: '+996 709 742 802',
      responseTime: 'отвечает сегодня'
    },
    isFeatured: false
  },
  {
    id: 'kia-sportage-2022',
    brand: 'Kia',
    model: 'Sportage',
    title: 'Kia Sportage 1.6 T-GDI GT-Line',
    price: 31200,
    year: 2022,
    mileage: 25300,
    fuel: 'Бензин',
    transmission: 'Робот',
    city: 'Баткен',
    priceBadge: 'Top deal',
    images: [
      image('photo-1549317661-bd32c8ce0db2'),
      image('photo-1603386329225-868f9b1ee6c9'),
      image('photo-1502877338535-766e1452684a')
    ],
    engine: '1.6 л T-GDI',
    drivetrain: 'Передний',
    power: 180,
    color: 'Experience Green',
    description:
      'Современный Sportage в GT-Line с панорамным дисплеем, камерой 360, вентиляцией сидений и заводской гарантией. Авто в отличной комплектации.',
    seller: {
      name: 'Batken Auto Center',
      type: 'Дилер',
      rating: 4.5,
      phone: '+996 705 510 738',
      responseTime: 'отвечает в течение часа'
    },
    isFeatured: false
  },
  {
    id: 'mazda-cx5-2020',
    brand: 'Mazda',
    model: 'CX-5',
    title: 'Mazda CX-5 Skyactiv-G AWD',
    price: 24950,
    year: 2020,
    mileage: 58100,
    fuel: 'Бензин',
    transmission: 'Автомат',
    city: 'Кара-Балта',
    priceBadge: 'Fair price',
    images: [
      image('photo-1535732820275-9ffd998cac22'),
      image('photo-1552519507-da3b142c6e3d'),
      image('photo-1494976388531-d1058494cdd8')
    ],
    engine: '2.0 л Skyactiv-G',
    drivetrain: 'Полный',
    power: 165,
    color: 'Soul Red Crystal',
    description:
      'CX-5 с полным приводом, проекционным дисплеем, Bose, адаптивным круизом и камерой заднего вида. Ухоженный автомобиль от частного владельца.',
    seller: {
      name: 'Айжан Осмонова',
      type: 'Частный продавец',
      rating: 4.7,
      phone: '+996 555 845 160',
      responseTime: 'отвечает вечером'
    },
    isFeatured: false
  },
  {
    id: 'ford-focus-2019',
    brand: 'Ford',
    model: 'Focus',
    title: 'Ford Focus Turnier EcoBoost ST-Line',
    price: 16400,
    year: 2019,
    mileage: 86700,
    fuel: 'Бензин',
    transmission: 'Механика',
    city: 'Балыкчы',
    priceBadge: 'Хорошая цена',
    images: [
      image('photo-1503736334956-4c8f8e92946d'),
      image('photo-1542362567-b07e54358753'),
      image('photo-1549924231-f129b911e442')
    ],
    engine: '1.0 л EcoBoost',
    drivetrain: 'Передний',
    power: 125,
    color: 'Magnetic Grey',
    description:
      'Focus ST-Line с механической коробкой, спортивными сиденьями, подогревом лобового стекла и вместительным багажником. Недорогой в обслуживании.',
    seller: {
      name: 'Balykchy Drive',
      type: 'Дилер',
      rating: 4.3,
      phone: '+996 700 640 231',
      responseTime: 'отвечает в течение дня'
    },
    isFeatured: false
  },
  {
    id: 'renault-megane-2021',
    brand: 'Renault',
    model: 'Megane',
    title: 'Renault Megane E-Tech Plug-in',
    price: 21800,
    year: 2021,
    mileage: 49100,
    fuel: 'Гибрид',
    transmission: 'Автомат',
    city: 'Узген',
    priceBadge: 'Fair price',
    images: [
      image('photo-1525609004556-c46c7d6cf023'),
      image('photo-1494905998402-395d579af36f'),
      image('photo-1502877338535-766e1452684a')
    ],
    engine: '1.6 л Plug-in Hybrid',
    drivetrain: 'Передний',
    power: 160,
    color: 'Iron Blue',
    description:
      'Подзаряжаемый гибрид с комбинированной навигацией, адаптивным круиз-контролем и экономичным городским режимом. Зарядный кабель в комплекте.',
    seller: {
      name: 'Uzgen Mobility',
      type: 'Дилер',
      rating: 4.4,
      phone: '+996 707 338 901',
      responseTime: 'отвечает сегодня'
    },
    isFeatured: false
  },
  {
    id: 'mini-cooper-2022',
    brand: 'MINI',
    model: 'Cooper',
    title: 'MINI Cooper S 3-Türer',
    price: 26900,
    year: 2022,
    mileage: 19600,
    fuel: 'Бензин',
    transmission: 'Автомат',
    city: 'Чолпон-Ата',
    priceBadge: 'Top deal',
    images: [
      image('photo-1503376780353-7e6692767b70'),
      image('photo-1552519507-da3b142c6e3d'),
      image('photo-1541899481282-d53bffe3c35d')
    ],
    engine: '2.0 л TwinPower Turbo',
    drivetrain: 'Передний',
    power: 178,
    color: 'British Racing Green',
    description:
      'Компактный Cooper S с LED, Harman Kardon, спортивными сиденьями, навигацией и низким пробегом. Живой городской автомобиль с ярким характером.',
    seller: {
      name: 'Cholpon-Ata Compact Cars',
      type: 'Дилер',
      rating: 4.6,
      phone: '+996 500 908 714',
      responseTime: 'обычно отвечает за 30 минут'
    },
    isFeatured: false
  }
]
