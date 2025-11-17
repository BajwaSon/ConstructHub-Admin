/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";

@Component({
  selector: "app-plain-map-tracker",
  standalone: true,
  templateUrl: "./plain-map-tracker.component.html",
  styleUrl: "./plain-map-tracker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlainMapTrackerComponent implements AfterViewInit, OnDestroy {
  scale = 1;
  MIN_SCALE = 0.5;
  MAX_SCALE = 3;
  SCALE_STEP = 0.2;
  isDragging = false;
  lastX = 0;
  lastY = 0;
  offsetX = 0;
  offsetY = 0;
  autoZoomInterval: any = null;
  isZoomedIn = false;
  dotInterval: any = null;
  currentDotCount = 0;
  minGap = 4; // Reduced gap to allow more dots

  private currentAudios: HTMLAudioElement[] = [];
  private currentIndex = 0;

  dots = [
    {
      x: 5,
      y: 13,
      Type: "Carpenter",
      FlyID: "WRK-86234696",
      City: "Building A",
      Date: "12 May",
      Gate: "Zone-09",
      BoardingSt: "1409",
      GateClasesAt: "1500",
      Seat: "Station-45B",
      Zone: "D",
      lang: "english",
    },
    {
      x: 8,
      y: 17,
      Type: "Laborer",
      FlyID: "WRK-23984712",
      City: "Building B",
      Date: "13 May",
      Gate: "Zone-08",
      BoardingSt: "1415",
      GateClasesAt: "1505",
      Seat: "Station-18C",
      Zone: "D",
      lang: "arabic",
    },
    {
      x: 5,
      y: 20,
      Type: "Supervisor",
      FlyID: "WRK-98472635",
      City: "Building C",
      Date: "2 July",
      Gate: "Zone-04",
      BoardingSt: "1920",
      GateClasesAt: "1950",
      Seat: "Station-1F",
      Zone: "A",
      lang: "hindi",
    },
    {
      x: 10,
      y: 20,
      Type: "Electrician",
      FlyID: "WRK-38475621",
      City: "Site A",
      Date: "16 June",
      Gate: "Zone-11",
      BoardingSt: "1235",
      GateClasesAt: "1305",
      Seat: "Station-23A",
      Zone: "C",
      lang: "english",
    },
    {
      x: 8,
      y: 25,
      Type: "Plumber",
      FlyID: "WRK-56372819",
      City: "Site B",
      Date: "8 May",
      Gate: "Zone-07",
      BoardingSt: "1500",
      GateClasesAt: "1530",
      Seat: "Station-3B",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 13,
      y: 35,
      Type: "Welder",
      FlyID: "WRK-82736491",
      City: "Site C",
      Date: "21 June",
      Gate: "Zone-02",
      BoardingSt: "1120",
      GateClasesAt: "1150",
      Seat: "Station-42D",
      Zone: "C",
      lang: "hindi",
    },
    {
      x: 13,
      y: 30,
      Type: "Supervisor",
      FlyID: "WRK-29384765",
      City: "Zone A",
      Date: "30 May",
      Gate: "Zone-05",
      BoardingSt: "2205",
      GateClasesAt: "2235",
      Seat: "Station-1A",
      Zone: "A",
      lang: "english",
    },
    {
      x: 16,
      y: 43,
      Type: "Laborer",
      FlyID: "WRK-67584932",
      City: "Zone B",
      Date: "17 June",
      Gate: "Zone-14",
      BoardingSt: "1350",
      GateClasesAt: "1420",
      Seat: "Station-38B",
      Zone: "D",
      lang: "arabic",
    },
    {
      x: 18,
      y: 47,
      Type: "Electrician",
      FlyID: "WRK-38475912",
      City: "Zone C",
      Date: "5 July",
      Gate: "Zone-01",
      BoardingSt: "1735",
      GateClasesAt: "1805",
      Seat: "Station-5C",
      Zone: "B",
      lang: "hindi",
    },
    {
      x: 20,
      y: 55,
      Type: "Mason",
      FlyID: "WRK-47582916",
      City: "Area A",
      Date: "10 June",
      Gate: "Zone-01",
      BoardingSt: "0915",
      GateClasesAt: "0945",
      Seat: "Station-01",
      Zone: "C",
      lang: "english",
    },
    {
      x: 16,
      y: 36,
      Type: "Operator",
      FlyID: "WRK-95837462",
      City: "Area B",
      Date: "25 June",
      Gate: "Zone-02",
      BoardingSt: "2005",
      GateClasesAt: "2035",
      Seat: "Station-02",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 20,
      y: 60,
      Type: "Painter",
      FlyID: "WRK-83749261",
      City: "Area C",
      Date: "12 July",
      Gate: "Zone-03",
      BoardingSt: "1650",
      GateClasesAt: "1720",
      Seat: "Station-03",
      Zone: "B",
      lang: "hindi",
    },
    {
      x: 25,
      y: 85,
      Type: "Roofer",
      FlyID: "WRK-29485736",
      City: "Building A",
      Date: "28 June",
      Gate: "Zone-04",
      BoardingSt: "1130",
      GateClasesAt: "1200",
      Seat: "Station-04",
      Zone: "D",
      lang: "english",
    },
    {
      x: 28,
      y: 75,
      Type: "Laborer",
      FlyID: "WRK-38475629",
      City: "Building B",
      Date: "3 July",
      Gate: "Zone-05",
      BoardingSt: "1455",
      GateClasesAt: "1525",
      Seat: "Station-05",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 35,
      y: 70,
      Type: "Electrician",
      FlyID: "WRK-84736215",
      City: "Building C",
      Date: "14 June",
      Gate: "Zone-06",
      BoardingSt: "2100",
      GateClasesAt: "2130",
      Seat: "Station-06",
      Zone: "A",
      lang: "hindi",
    },
    {
      x: 42,
      y: 65,
      Type: "Carpenter",
      FlyID: "WRK-58374621",
      City: "Site A",
      Date: "18 May",
      Gate: "Zone-07",
      BoardingSt: "1230",
      GateClasesAt: "1300",
      Seat: "Station-07",
      Zone: "C",
      lang: "english",
    },
    {
      x: 46,
      y: 65,
      Type: "Supervisor",
      FlyID: "WRK-92837465",
      City: "Site B",
      Date: "6 July",
      Gate: "Zone-08",
      BoardingSt: "1755",
      GateClasesAt: "1825",
      Seat: "Station-08",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 52,
      y: 55,
      Type: "Plumber",
      FlyID: "WRK-38475692",
      City: "Site C",
      Date: "22 June",
      Gate: "Zone-09",
      BoardingSt: "1105",
      GateClasesAt: "1135",
      Seat: "Station-09",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 56,
      y: 60,
      Type: "Welder",
      FlyID: "WRK-48372619",
      City: "Zone A",
      Date: "1 July",
      Gate: "Zone-10",
      BoardingSt: "1620",
      GateClasesAt: "1650",
      Seat: "Station-10",
      Zone: "B",
      lang: "english",
    },
    {
      x: 58,
      y: 53,
      Type: "Mason",
      FlyID: "WRK-92837456",
      City: "Zone B",
      Date: "20 June",
      Gate: "Zone-11",
      BoardingSt: "2045",
      GateClasesAt: "2115",
      Seat: "Station-11",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 62,
      y: 65,
      Type: "Operator",
      FlyID: "WRK-37485629",
      City: "Zone C",
      Date: "11 May",
      Gate: "Zone-12",
      BoardingSt: "0910",
      GateClasesAt: "0940",
      Seat: "Station-12",
      Zone: "C",
      lang: "hindi",
    },
    {
      x: 66,
      y: 65,
      Type: "Painter",
      FlyID: "WRK-84736295",
      City: "Area A",
      Date: "16 July",
      Gate: "Zone-13",
      BoardingSt: "1555",
      GateClasesAt: "1625",
      Seat: "Station-13",
      Zone: "B",
      lang: "english",
    },
    {
      x: 70,
      y: 54,
      Type: "Roofer",
      FlyID: "WRK-92837415",
      City: "Area B",
      Date: "9 June",
      Gate: "Zone-14",
      BoardingSt: "1145",
      GateClasesAt: "1215",
      Seat: "Station-14",
      Zone: "D",
      lang: "arabic",
    },
    {
      x: 76,
      y: 55,
      Type: "Laborer",
      FlyID: "WRK-38475619",
      City: "Area C",
      Date: "27 June",
      Gate: "Zone-15",
      BoardingSt: "2135",
      GateClasesAt: "2205",
      Seat: "Station-15",
      Zone: "A",
      lang: "hindi",
    },
    {
      x: 82,
      y: 53,
      Type: "Electrician",
      FlyID: "WRK-84736271",
      City: "Building A",
      Date: "19 May",
      Gate: "Zone-16",
      BoardingSt: "0950",
      GateClasesAt: "1020",
      Seat: "Station-16",
      Zone: "C",
      lang: "english",
    },
    {
      x: 61,
      y: 56,
      Type: "Carpenter",
      FlyID: "WRK-58374692",
      City: "Building B",
      Date: "15 July",
      Gate: "Zone-17",
      BoardingSt: "1725",
      GateClasesAt: "1755",
      Seat: "Station-17",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 72,
      y: 60,
      Type: "Supervisor",
      FlyID: "WRK-38475912",
      City: "Building C",
      Date: "7 June",
      Gate: "Zone-18",
      BoardingSt: "1205",
      GateClasesAt: "1235",
      Seat: "Station-18",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 66,
      y: 57,
      Type: "Plumber",
      FlyID: "WRK-12983745",
      City: "Site A",
      Date: "24 June",
      Gate: "Zone-19",
      BoardingSt: "1635",
      GateClasesAt: "1715",
      Seat: "Station-19",
      Zone: "B",
      lang: "english",
    },
    {
      x: 74,
      y: 57,
      Type: "Welder",
      FlyID: "WRK-91827364",
      City: "Site B",
      Date: "15 June",
      Gate: "Zone-20",
      BoardingSt: "1600",
      GateClasesAt: "1630",
      Seat: "Station-20",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 49,
      y: 59,
      Type: "Mason",
      FlyID: "WRK-82736495",
      City: "Site C",
      Date: "20 May",
      Gate: "Zone-21",
      BoardingSt: "1415",
      GateClasesAt: "1445",
      Seat: "Station-21",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 82,
      y: 60,
      Type: "Operator",
      FlyID: "WRK-27364581",
      City: "Zone A",
      Date: "10 July",
      Gate: "Zone-22",
      BoardingSt: "1930",
      GateClasesAt: "2000",
      Seat: "Station-22",
      Zone: "A",
      lang: "english",
    },
    {
      x: 86,
      y: 55,
      Type: "Painter",
      FlyID: "WRK-37482915",
      City: "Zone B",
      Date: "25 June",
      Gate: "Zone-23",
      BoardingSt: "1205",
      GateClasesAt: "1235",
      Seat: "Station-23",
      Zone: "C",
      lang: "english",
    },
    {
      x: 88,
      y: 60,
      Type: "Roofer",
      FlyID: "WRK-56473829",
      City: "Zone C",
      Date: "5 July",
      Gate: "Zone-24",
      BoardingSt: "1505",
      GateClasesAt: "1535",
      Seat: "Station-24",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 96,
      y: 62,
      Type: "Laborer",
      FlyID: "WRK-91827346",
      City: "Area A",
      Date: "18 June",
      Gate: "Zone-25",
      BoardingSt: "1110",
      GateClasesAt: "1140",
      Seat: "Station-25",
      Zone: "C",
      lang: "hindi",
    },
    {
      x: 93,
      y: 60,
      Type: "Electrician",
      FlyID: "WRK-82736419",
      City: "Area B",
      Date: "12 May",
      Gate: "Zone-26",
      BoardingSt: "2215",
      GateClasesAt: "2245",
      Seat: "Station-26",
      Zone: "A",
      lang: "english",
    },
    {
      x: 85,
      y: 65,
      Type: "Carpenter",
      FlyID: "WRK-19283746",
      City: "Area C",
      Date: "7 July",
      Gate: "Zone-27",
      BoardingSt: "1345",
      GateClasesAt: "1415",
      Seat: "Station-27",
      Zone: "D",
      lang: "arabic",
    },
    {
      x: 23,
      y: 90,
      Type: "Supervisor",
      FlyID: "WRK-56473829",
      City: "Building A",
      Date: "22 June",
      Gate: "Zone-28",
      BoardingSt: "1740",
      GateClasesAt: "1810",
      Seat: "Station-28",
      Zone: "B",
      lang: "hindi",
    },
    {
      x: 25,
      y: 75,
      Type: "Plumber",
      FlyID: "WRK-91827365",
      City: "Building B",
      Date: "16 May",
      Gate: "Zone-29",
      BoardingSt: "0925",
      GateClasesAt: "0955",
      Seat: "Station-29",
      Zone: "C",
      lang: "english",
    },
    {
      x: 22,
      y: 70,
      Type: "Welder",
      FlyID: "WRK-82736491",
      City: "Building C",
      Date: "30 June",
      Gate: "Zone-30",
      BoardingSt: "2015",
      GateClasesAt: "2045",
      Seat: "Station-30",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 38,
      y: 70,
      Type: "Mason",
      FlyID: "WRK-56473819",
      City: "Site A",
      Date: "8 July",
      Gate: "Zone-31",
      BoardingSt: "1705",
      GateClasesAt: "1735",
      Seat: "Station-31",
      Zone: "B",
      lang: "hindi",
    },
    {
      x: 50,
      y: 65,
      Type: "Operator",
      FlyID: "WRK-91827364",
      City: "Site B",
      Date: "14 June",
      Gate: "Zone-32",
      BoardingSt: "1120",
      GateClasesAt: "1150",
      Seat: "Station-32",
      Zone: "D",
      lang: "english",
    },
    {
      x: 19,
      y: 83,
      Type: "Painter",
      FlyID: "WRK-82736418",
      City: "Site C",
      Date: "19 May",
      Gate: "Zone-33",
      BoardingSt: "1500",
      GateClasesAt: "1530",
      Seat: "Station-33",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 25,
      y: 90,
      Type: "Roofer",
      FlyID: "WRK-19283746",
      City: "Zone A",
      Date: "3 July",
      Gate: "Zone-34",
      BoardingSt: "2105",
      GateClasesAt: "2135",
      Seat: "Station-34",
      Zone: "A",
      lang: "hindi",
    },
    {
      x: 29,
      y: 81,
      Type: "Laborer",
      FlyID: "WRK-91827345",
      City: "Zone B",
      Date: "25 May",
      Gate: "Zone-35",
      BoardingSt: "1230",
      GateClasesAt: "1300",
      Seat: "Station-35",
      Zone: "C",
      lang: "english",
    },
    {
      x: 29,
      y: 65,
      Type: "Electrician",
      FlyID: "WRK-82736419",
      City: "Zone C",
      Date: "11 June",
      Gate: "Zone-36",
      BoardingSt: "1800",
      GateClasesAt: "1830",
      Seat: "Station-36",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 93,
      y: 66,
      Type: "Carpenter",
      FlyID: "WRK-56473829",
      City: "Area A",
      Date: "6 July",
      Gate: "Zone-37",
      BoardingSt: "1100",
      GateClasesAt: "1130",
      Seat: "Station-37",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 53,
      y: 20,
      Type: "Supervisor",
      FlyID: "WRK-91827364",
      City: "Area B",
      Date: "9 May",
      Gate: "Zone-38",
      BoardingSt: "1615",
      GateClasesAt: "1645",
      Seat: "Station-38",
      Zone: "B",
      lang: "english",
    },
    {
      x: 51,
      y: 10,
      Type: "Plumber",
      FlyID: "WRK-82736491",
      City: "Area C",
      Date: "24 June",
      Gate: "Zone-39",
      BoardingSt: "2025",
      GateClasesAt: "2055",
      Seat: "Station-39",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 53,
      y: 9,
      Type: "Welder",
      FlyID: "WRK-19283746",
      City: "Building A",
      Date: "13 July",
      Gate: "Zone-40",
      BoardingSt: "0900",
      GateClasesAt: "0930",
      Seat: "Station-40",
      Zone: "C",
      lang: "hindi",
    },
    {
      x: 51,
      y: 5,
      Type: "Mason",
      FlyID: "WRK-91827364",
      City: "Building B",
      Date: "28 May",
      Gate: "Zone-41",
      BoardingSt: "1550",
      GateClasesAt: "1620",
      Seat: "Station-41",
      Zone: "B",
      lang: "english",
    },
    {
      x: 53,
      y: 17,
      Type: "Operator",
      FlyID: "WRK-82736415",
      City: "Building C",
      Date: "2 June",
      Gate: "Zone-42",
      BoardingSt: "2145",
      GateClasesAt: "2215",
      Seat: "Station-42",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 53,
      y: 23,
      Type: "Painter",
      FlyID: "WRK-19283746",
      City: "Site A",
      Date: "17 July",
      Gate: "Zone-43",
      BoardingSt: "0935",
      GateClasesAt: "1005",
      Seat: "Station-43",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 52,
      y: 27,
      Type: "Roofer",
      FlyID: "WRK-91827365",
      City: "Site B",
      Date: "21 June",
      Gate: "Zone-44",
      BoardingSt: "1710",
      GateClasesAt: "1740",
      Seat: "Station-44",
      Zone: "B",
      lang: "english",
    },
    {
      x: 53,
      y: 30,
      Type: "Laborer",
      FlyID: "WRK-73829104",
      City: "Site C",
      Date: "5 June",
      Gate: "Zone-45",
      BoardingSt: "1605",
      GateClasesAt: "1635",
      Seat: "Station-45",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 53,
      y: 35,
      Type: "Electrician",
      FlyID: "WRK-28493017",
      City: "Zone A",
      Date: "12 May",
      Gate: "Zone-46",
      BoardingSt: "1410",
      GateClasesAt: "1440",
      Seat: "Station-46",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 54,
      y: 38,
      Type: "Carpenter",
      FlyID: "WRK-91827340",
      City: "Zone B",
      Date: "22 June",
      Gate: "Zone-47",
      BoardingSt: "1935",
      GateClasesAt: "2005",
      Seat: "Station-47",
      Zone: "A",
      lang: "english",
    },
    {
      x: 52,
      y: 33,
      Type: "Supervisor",
      FlyID: "WRK-37482904",
      City: "Zone C",
      Date: "18 July",
      Gate: "Zone-48",
      BoardingSt: "1200",
      GateClasesAt: "1230",
      Seat: "Station-48",
      Zone: "C",
      lang: "arabic",
    },
    {
      x: 53,
      y: 42,
      Type: "Plumber",
      FlyID: "WRK-56473820",
      City: "Area A",
      Date: "9 June",
      Gate: "Zone-49",
      BoardingSt: "1500",
      GateClasesAt: "1530",
      Seat: "Station-49",
      Zone: "B",
      lang: "hindi",
    },
    {
      x: 51,
      y: 45,
      Type: "Welder",
      FlyID: "WRK-91827355",
      City: "Area B",
      Date: "14 May",
      Gate: "Zone-50",
      BoardingSt: "1115",
      GateClasesAt: "1145",
      Seat: "Station-50",
      Zone: "C",
      lang: "english",
    },
    {
      x: 55,
      y: 48,
      Type: "Mason",
      FlyID: "WRK-82736420",
      City: "Area C",
      Date: "1 July",
      Gate: "Zone-51",
      BoardingSt: "2210",
      GateClasesAt: "2240",
      Seat: "Station-51",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 40,
      y: 61,
      Type: "Operator",
      FlyID: "WRK-19283751",
      City: "Building A",
      Date: "7 July",
      Gate: "Zone-52",
      BoardingSt: "1340",
      GateClasesAt: "1410",
      Seat: "Station-52",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 37,
      y: 61,
      Type: "Painter",
      FlyID: "WRK-56473825",
      City: "Building B",
      Date: "24 June",
      Gate: "Zone-53",
      BoardingSt: "1730",
      GateClasesAt: "1800",
      Seat: "Station-53",
      Zone: "B",
      lang: "english",
    },
    {
      x: 45,
      y: 55,
      Type: "Roofer",
      FlyID: "WRK-91827350",
      City: "Building C",
      Date: "16 June",
      Gate: "Zone-54",
      BoardingSt: "0930",
      GateClasesAt: "1000",
      Seat: "Station-54",
      Zone: "C",
      lang: "arabic",
    },
    {
      x: 35,
      y: 61,
      Type: "Laborer",
      FlyID: "WRK-82736425",
      City: "Site A",
      Date: "3 July",
      Gate: "Zone-55",
      BoardingSt: "2010",
      GateClasesAt: "2040",
      Seat: "Station-55",
      Zone: "A",
      lang: "hindi",
    },
    {
      x: 85,
      y: 5,
      Type: "Electrician",
      FlyID: "WRK-56473814",
      City: "Site B",
      Date: "10 May",
      Gate: "Zone-56",
      BoardingSt: "1700",
      GateClasesAt: "1730",
      Seat: "Station-56",
      Zone: "B",
      lang: "english",
    },
    {
      x: 83,
      y: 8,
      Type: "Carpenter",
      FlyID: "WRK-91827340",
      City: "Site C",
      Date: "19 June",
      Gate: "Zone-57",
      BoardingSt: "1125",
      GateClasesAt: "1155",
      Seat: "Station-57",
      Zone: "D",
      lang: "arabic",
    },
    {
      x: 85,
      y: 14,
      Type: "Supervisor",
      FlyID: "WRK-82736421",
      City: "Zone A",
      Date: "28 July",
      Gate: "Zone-58",
      BoardingSt: "2100",
      GateClasesAt: "2130",
      Seat: "Station-58",
      Zone: "A",
      lang: "hindi",
    },
    {
      x: 84,
      y: 20,
      Type: "Plumber",
      FlyID: "WRK-19283751",
      City: "Zone B",
      Date: "14 June",
      Gate: "Zone-59",
      BoardingSt: "0915",
      GateClasesAt: "0945",
      Seat: "Station-59",
      Zone: "C",
      lang: "english",
    },
    {
      x: 83,
      y: 25,
      Type: "Welder",
      FlyID: "WRK-91827335",
      City: "Zone C",
      Date: "5 July",
      Gate: "Zone-60",
      BoardingSt: "1505",
      GateClasesAt: "1535",
      Seat: "Station-60",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 87,
      y: 4,
      Type: "Mason",
      FlyID: "WRK-82736430",
      City: "Area A",
      Date: "18 May",
      Gate: "Zone-61",
      BoardingSt: "1100",
      GateClasesAt: "1130",
      Seat: "Station-61",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 83,
      y: 31,
      Type: "Operator",
      FlyID: "WRK-56473821",
      City: "Area B",
      Date: "11 June",
      Gate: "Zone-62",
      BoardingSt: "2205",
      GateClasesAt: "2235",
      Seat: "Station-62",
      Zone: "A",
      lang: "english",
    },
    {
      x: 90,
      y: 52,
      Type: "Painter",
      FlyID: "WRK-91827345",
      City: "Area C",
      Date: "6 July",
      Gate: "Zone-63",
      BoardingSt: "1610",
      GateClasesAt: "1640",
      Seat: "Station-63",
      Zone: "B",
      lang: "arabic",
    },
    {
      x: 83,
      y: 37,
      Type: "Roofer",
      FlyID: "WRK-82736422",
      City: "Building A",
      Date: "23 June",
      Gate: "Zone-64",
      BoardingSt: "0920",
      GateClasesAt: "0950",
      Seat: "Station-64",
      Zone: "C",
      lang: "hindi",
    },
    {
      x: 84,
      y: 42,
      Type: "Laborer",
      FlyID: "WRK-19283755",
      City: "Building B",
      Date: "15 May",
      Gate: "Zone-65",
      BoardingSt: "1555",
      GateClasesAt: "1625",
      Seat: "Station-65",
      Zone: "B",
      lang: "english",
    },
    {
      x: 81,
      y: 46,
      Type: "Electrician",
      FlyID: "WRK-91827350",
      City: "Building C",
      Date: "26 July",
      Gate: "Zone-66",
      BoardingSt: "2130",
      GateClasesAt: "2200",
      Seat: "Station-66",
      Zone: "A",
      lang: "arabic",
    },
    {
      x: 85,
      y: 49,
      Type: "Carpenter",
      FlyID: "WRK-82736423",
      City: "Site A",
      Date: "9 June",
      Gate: "Zone-67",
      BoardingSt: "0905",
      GateClasesAt: "0935",
      Seat: "Station-67",
      Zone: "D",
      lang: "hindi",
    },
    {
      x: 78,
      y: 59,
      Type: "Supervisor",
      FlyID: "WRK-19283741",
      City: "Site B",
      Date: "30 June",
      Gate: "Zone-68",
      BoardingSt: "1715",
      GateClasesAt: "1745",
      Seat: "Station-68",
      Zone: "B",
      lang: "english",
    },
    {
      x: 75,
      y: 65,
      Type: "Plumber",
      FlyID: "WRK-91827341",
      City: "Site C",
      Date: "20 May",
      Gate: "Zone-69",
      BoardingSt: "2140",
      GateClasesAt: "2210",
      Seat: "Station-69",
      Zone: "A",
      lang: "arabic",
    },
  ];

  // Construction site foreman positions - all on site
  securityGuards = [
    { x: 5, y: 15, name: "Foreman Johnson", status: "active" },
    { x: 20, y: 50, name: "Site Foreman Smith", status: "active" },
    { x: 35, y: 58, name: "Foreman Davis", status: "active" },
    { x: 60, y: 60, name: "Senior Foreman Wilson", status: "active" },
    { x: 50, y: 10, name: "Foreman Brown", status: "active" },
    { x: 75, y: 60, name: "Project Foreman Miller", status: "active" },
    { x: 90, y: 55, name: "Foreman Garcia", status: "active" },
    { x: 84, y: 15, name: "Lead Foreman Martinez", status: "active" },
    { x: 25, y: 80, name: "Foreman Anderson", status: "active" },
    { x: 50, y: 45, name: "Construction Foreman Taylor", status: "active" },
  ];

  // Define zoom targets for areas
  AREA_ZONES = {
    leftPart: { x: 15, y: 50, zoomLevel: 2.2 },
    centerPart: { x: 35, y: 45, zoomLevel: 2 },
    rightPart: { x: 60, y: 45, zoomLevel: 2 },
    leftPanel: { x: 10, y: 20, zoomLevel: 3 },
    middlePanel: { x: 50, y: 20, zoomLevel: 3 },
    rightPanel: { x: 90, y: 20, zoomLevel: 3 },
  };

  ngAfterViewInit(): void {
    this.addEventListeners();
    this.startRandomDots();
    document.addEventListener("click", (e: MouseEvent) => {
      const popup = document.getElementById("dotPopup");
      if (!popup) return;
      if (!(e.target as HTMLElement).classList.contains("pulse-dot") && !(e.target as HTMLElement).classList.contains("security-guard")) {
        popup.style.display = "none";
        popup.removeAttribute("data-persist");
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.autoZoomInterval);
    clearInterval(this.dotInterval);
    this.currentIndex = 0;
  }

  /** ---------- Zoom Transform Handling ---------- */
  setTransform(animate = false): void {
    const floorPlan = document.getElementById("floorPlan");
    const zoomLevel = document.getElementById("zoomLevel");

    if (!floorPlan || !zoomLevel) return;

    floorPlan.style.transition = animate ? "transform 1.5s ease-in-out" : "none";
    floorPlan.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
    zoomLevel.textContent = `${Math.round(this.scale * 100)}%`;
  }

  zoomIn(): void {
    if (this.scale < this.MAX_SCALE) {
      this.scale += this.SCALE_STEP;
      this.setTransform();
    }
  }

  zoomOut(): void {
    if (this.scale > this.MIN_SCALE) {
      this.scale -= this.SCALE_STEP;
      this.setTransform();
    }
  }

  resetZoom(): void {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.setTransform();
  }

  zoomToClassroom(area: { x: number; y: number; zoomLevel: number }): void {
    const mapContainer = document.getElementById("mapContainer");
    if (!mapContainer) return;

    this.scale = area.zoomLevel;
    const containerWidth = mapContainer.offsetWidth;
    const containerHeight = mapContainer.offsetHeight;

    this.offsetX = -((area.x / 100) * containerWidth * this.scale) + containerWidth / 2;
    this.offsetY = -((area.y / 100) * containerHeight * this.scale) + containerHeight / 2;

    this.setTransform(true);
  }

  /** ---------- Drag / Wheel ---------- */
  startDrag(e: MouseEvent): void {
    if (e.button === 0) {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      e.preventDefault();
    }
  }

  drag(e: MouseEvent): void {
    if (this.isDragging) {
      this.offsetX += e.clientX - this.lastX;
      this.offsetY += e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.setTransform();
      e.preventDefault();
    }
  }

  endDrag(): void {
    this.isDragging = false;
  }

  handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    delta > 0 ? this.zoomIn() : this.zoomOut();
  }

  /** ---------- Auto Zoom ---------- */
  resetZoomWithAnimation(): void {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.setTransform(true);
    this.isZoomedIn = false;
  }

  /** ---------- Event Listeners ---------- */
  addEventListeners(): void {
    const mapContainer = document.getElementById("floorPlan");
    if (!mapContainer) return;

    document.getElementById("zoomIn")?.addEventListener("click", () => this.zoomIn());
    document.getElementById("zoomOut")?.addEventListener("click", () => this.zoomOut());
    document.getElementById("zoomReset")?.addEventListener("click", () => this.resetZoom());

    document.getElementById("zoomLeftArea")?.addEventListener("click", () => this.zoomToClassroom(this.AREA_ZONES.leftPart));
    document.getElementById("zoomCenterArea")?.addEventListener("click", () => this.zoomToClassroom(this.AREA_ZONES.centerPart));
    document.getElementById("zoomRightArea")?.addEventListener("click", () => this.zoomToClassroom(this.AREA_ZONES.rightPart));

    mapContainer.addEventListener("mousedown", e => this.startDrag(e));
    document.addEventListener("mousemove", e => this.drag(e));
    document.addEventListener("mouseup", () => this.endDrag());
    mapContainer.addEventListener("wheel", e => this.handleWheel(e));
  }

  /** ---------- Dot generation ---------- */
  startRandomDots(): void {
    const container = document.getElementById("pulseDotsContainer");
    if (!container) return;
    container.innerHTML = "";
    this.currentDotCount = 0;

    for (const dot of this.dots) {
      this.addDotAtPosition(dot.x, dot.y, dot.Type, dot.FlyID, dot.City, dot.Date, dot.Gate, dot.BoardingSt, dot.GateClasesAt, dot.Seat, dot.Zone, dot.lang);
    }

    // Add security guards
    for (const guard of this.securityGuards) {
      this.addSecurityGuardAtPosition(guard.x, guard.y, guard.name, guard.status);
    }
  }

  addDotAtPosition(
    x: number,
    y: number,
    type?: string,
    flyid?: any,
    city?: string,
    date?: any,
    gate?: any,
    boardingst?: any,
    gateclasesat?: any,
    seat?: any,
    zone?: string,
    lang?: string
  ): void {
    const container = document.getElementById("pulseDotsContainer");
    if (!container) return;

    const dot = document.createElement("div");
    dot.className = "pulse-dot";
    dot.style.position = "absolute";
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;

    // Store details as data attributes
    dot.dataset["Type"] = type || "Unknown";
    dot.dataset["FlyID"] = flyid || "Unknown";
    dot.dataset["City"] = city || "Unknown";
    dot.dataset["Date"] = date || "Unknown";
    dot.dataset["Gate"] = gate || "Unknown";
    dot.dataset["BoardingSt"] = boardingst || "Unknown";
    dot.dataset["GateClasesAt"] = gateclasesat || "Unknown";
    dot.dataset["Seat"] = seat || "Unknown";
    dot.dataset["Zone"] = zone || "Unknown";
    dot.dataset["lang"] = lang || "english"; // Store lang attribute

    dot.addEventListener("mouseenter", e => this.showDotPopup(e, dot));
    dot.addEventListener("mouseleave", e => this.hideDotPopup(e));
    dot.addEventListener("mousemove", e => this.moveDotPopup(e));
    dot.addEventListener("click", e => this.showDotPopup(e, dot, true));

    container.appendChild(dot);
  }

  addSecurityGuardAtPosition(x: number, y: number, name: string, status: string): void {
    const container = document.getElementById("pulseDotsContainer");
    if (!container) return;

    const guardElement = document.createElement("div");
    guardElement.className = "security-guard";
    guardElement.style.position = "absolute";
    guardElement.style.left = `${x}%`;
    guardElement.style.top = `${y}%`;

    // Create the construction foreman icon using emoji
    const icon = document.createElement("div");
    icon.innerHTML = "👷";
    icon.style.fontSize = "28px";
    icon.style.textAlign = "center";
    icon.style.lineHeight = "32px";
    icon.style.filter = "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))";

    // Store guard details as data attributes
    guardElement.dataset["name"] = name;
    guardElement.dataset["status"] = status;

    guardElement.appendChild(icon);

    // Add hover effects
    guardElement.addEventListener("mouseenter", e => this.showSecurityGuardPopup(e, guardElement));
    guardElement.addEventListener("mouseleave", e => this.hideSecurityGuardPopup(e));
    guardElement.addEventListener("mousemove", e => this.moveSecurityGuardPopup(e));

    container.appendChild(guardElement);
  }

  showDotPopup(event: MouseEvent, dot: HTMLElement, persist = false): void {
    const popup = document.getElementById("dotPopup");
    if (!popup) return;

    if (persist && popup.style.display === "block" && popup.getAttribute("data-current-dot") === dot.dataset["FlyID"]) {
      return;
    }

    const type = dot.dataset["Type"];
    const flyid = dot.dataset["FlyID"];
    const date = dot.dataset["Date"];
    const boardingst = dot.dataset["BoardingSt"];
    const seat = dot.dataset["Seat"];

    // Generate worker name from ID
    const workerNames = [
      "John Smith",
      "Michael Johnson",
      "David Williams",
      "James Brown",
      "Robert Jones",
      "William Garcia",
      "Richard Miller",
      "Joseph Davis",
      "Thomas Rodriguez",
      "Charles Martinez",
      "Christopher Wilson",
      "Daniel Anderson",
      "Matthew Taylor",
      "Anthony Thomas",
      "Mark Jackson",
      "Donald White",
      "Steven Harris",
      "Paul Martin",
      "Andrew Thompson",
      "Joshua Moore",
    ];
    const nameIndex = parseInt(flyid?.replace("WRK-", "") || "0") % workerNames.length;
    const workerName = workerNames[nameIndex];

    // Generate age (25-55)
    const age = 25 + (parseInt(flyid?.replace("WRK-", "").substring(0, 2) || "0") % 31);

    // Generate gender
    const genders = ["Male", "Female"];
    const gender = genders[parseInt(flyid?.replace("WRK-", "").substring(2, 3) || "0") % 2];

    // Calculate employment duration (in years)
    const hireDateStr = date || "12 May";
    const dateParts = hireDateStr.split(" ");
    const hireDay = parseInt(dateParts[0]) || 12;
    const hireMonth = dateParts[1] || "May";
    // If no year in date, use a calculated year based on worker ID
    const hireYear = dateParts[2] ? parseInt(dateParts[2]) : 2020 + (parseInt(flyid?.replace("WRK-", "").substring(0, 2) || "0") % 5);
    const currentYear = new Date().getFullYear();
    const employmentYears = Math.max(1, currentYear - hireYear);
    const contractEndYear = hireYear + 3;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex =
      monthNames.findIndex(m => m.toLowerCase().startsWith(hireMonth.toLowerCase())) >= 0 ? monthNames.findIndex(m => m.toLowerCase().startsWith(hireMonth.toLowerCase())) : 4;
    const formattedHireDate = `${hireYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(hireDay).padStart(2, "0")}`;
    const formattedEndDate = `${contractEndYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(hireDay).padStart(2, "0")}`;

    // Determine status
    const status = boardingst ? "ACTIVE" : "ON LEAVE";
    const statusClass = status === "ACTIVE" ? "status-active" : "status-pending";

    // Create the new popup HTML structure matching the screenshot
    popup.innerHTML = `
      <div class="popup-header">
        <div class="profile-section">
          <div class="worker-avatar">
            <div class="avatar-initial">${workerName.charAt(0)}</div>
          </div>
          <div class="worker-name-section">
            <h3 class="worker-name">${workerName}</h3>
            <p class="worker-category">${type || "Construction Worker"}</p>
          </div>
          <div class="worker-status-badge ${statusClass}">
            ${status}
          </div>
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Worker ID:</span>
          <span class="info-value">${flyid || "N/A"}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Work Station:</span>
          <span class="info-value">${seat || "N/A"}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Department:</span>
          <span class="info-value">${type || "N/A"}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Employment Duration:</span>
          <span class="info-value">${employmentYears} years</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Hire Date:</span>
          <span class="info-value">${formattedHireDate}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Contract End Date:</span>
          <span class="info-value">${formattedEndDate}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Age:</span>
          <span class="info-value">${age}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Gender:</span>
          <span class="info-value">${gender}</span>
        </div>
      </div>

      <button class="close-btn">Close</button>
    `;

    const closeBtn = popup.querySelector(".close-btn") as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
        popup.removeAttribute("data-persist");
        popup.removeAttribute("data-current-dot");
      });
    }

    // Position the popup near the dot
    popup.style.display = "block";
    popup.style.visibility = "hidden";
    popup.setAttribute("data-persist", "true");

    // Get popup dimensions
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust horizontal position if popup would be cut off
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    // Adjust vertical position if popup would be cut off
    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    // Ensure popup doesn't go off-screen
    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.visibility = "visible"; // Show after positioning

    if (persist) {
      popup.setAttribute("data-persist", "true");
      popup.setAttribute("data-current-dot", flyid || "");
      // Add outside click listener for persistent popups
      setTimeout(() => {
        document.addEventListener("click", this.handleOutsideClick.bind(this));
      }, 100);
    } else {
      popup.removeAttribute("data-persist");
      popup.removeAttribute("data-current-dot");
    }
  }

  moveDotPopup(event: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (!popup || popup.getAttribute("data-persist") === "true") return;

    // Get popup dimensions for positioning
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust position to prevent cutoff
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }

  hideDotPopup(event?: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (popup && popup.getAttribute("data-persist") !== "true") {
      popup.style.display = "none";
    }
  }

  handleOutsideClick(event: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (!popup) return;
    if (popup.getAttribute("data-persist") === "true") {
      const target = event.target as HTMLElement;
      if (!popup.contains(target) && !target.classList.contains("pulse-dot") && !target.classList.contains("security-guard")) {
        popup.style.display = "none";
        popup.removeAttribute("data-persist");
        popup.removeAttribute("data-current-dot");
      }
    }
  }

  showSecurityGuardPopup(event: MouseEvent, guardElement: HTMLElement): void {
    const popup = document.getElementById("dotPopup");
    if (!popup) return;

    const name = guardElement.dataset["name"];
    const status = guardElement.dataset["status"];

    // Extract foreman name (remove titles)
    const foremanName = name?.replace(/Foreman |Site Foreman |Senior Foreman |Project Foreman |Lead Foreman |Construction Foreman /g, "") || "Unknown";

    // Generate foreman ID based on name hash
    const nameHash = foremanName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const foremanId = `FM-${String(nameHash).padStart(6, "0")}`;

    // Generate age (35-60 for foremen)
    const age = 35 + (nameHash % 26);

    // Generate gender
    const genders = ["Male", "Female"];
    const gender = genders[nameHash % 2];

    // Calculate employment duration (foremen typically have longer tenure)
    const baseYear = 2018;
    const yearsOfService = nameHash % 8;
    const hireYear = baseYear + yearsOfService;
    const currentYear = new Date().getFullYear();
    const employmentYears = Math.max(5, currentYear - hireYear);
    const contractEndYear = hireYear + 5;

    // Format dates
    const formattedHireDate = `${hireYear}-05-15`;
    const formattedEndDate = `${contractEndYear}-05-15`;

    // Determine status
    const statusText = status === "active" ? "ACTIVE" : "ON LEAVE";
    const statusClass = status === "active" ? "status-active" : "status-pending";

    // Get work station from position - find the foreman in securityGuards array
    const foremanData = this.securityGuards.find(g => g.name === name);
    const workStationX = foremanData?.x || 0;
    const workStation = `Zone-${Math.floor(workStationX / 10) + 1}`;

    // Create the foreman popup HTML matching worker format
    popup.innerHTML = `
      <div class="popup-header">
        <div class="profile-section">
          <div class="worker-avatar">
            <div class="avatar-initial">${foremanName.charAt(0)}</div>
          </div>
          <div class="worker-name-section">
            <h3 class="worker-name">${foremanName}</h3>
            <p class="worker-category">Foreman</p>
          </div>
          <div class="worker-status-badge ${statusClass}">
            ${statusText}
          </div>
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Foreman ID:</span>
          <span class="info-value">${foremanId}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Work Station:</span>
          <span class="info-value">${workStation}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Department:</span>
          <span class="info-value">Foreman</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Employment Duration:</span>
          <span class="info-value">${employmentYears} years</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Hire Date:</span>
          <span class="info-value">${formattedHireDate}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Contract End Date:</span>
          <span class="info-value">${formattedEndDate}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Age:</span>
          <span class="info-value">${age}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Gender:</span>
          <span class="info-value">${gender}</span>
        </div>
      </div>

      <button class="close-btn">Close</button>
    `;

    const closeBtn = popup.querySelector(".close-btn") as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
        popup.removeAttribute("data-persist");
        popup.removeAttribute("data-current-dot");
      });
    }

    // Position the popup near the guard
    popup.style.display = "block";
    popup.style.visibility = "hidden";

    // Get popup dimensions
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust horizontal position if popup would be cut off
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    // Adjust vertical position if popup would be cut off
    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    // Ensure popup doesn't go off-screen
    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.visibility = "visible";
  }

  hideSecurityGuardPopup(event?: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (popup && popup.getAttribute("data-persist") !== "true") {
      popup.style.display = "none";
    }
  }

  moveSecurityGuardPopup(event: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (!popup || popup.getAttribute("data-persist") === "true") return;

    // Get popup dimensions for positioning
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust position to prevent cutoff
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }
}
