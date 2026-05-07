import type { PriceResult } from "@/lib/pricing";

export type RoomOption = {
  roomTypeId: string;
  roomId: string;
  slug: string;
  nameDe: string;
  nameEn: string;
  subtitleDe: string | null;
  subtitleEn: string | null;
  capacity: number;
  basePrice: number;
  price: PriceResult;
};

export type Step = "dates" | "room" | "extras" | "details" | "review";

export type ExtraSlug = "halbpension" | "transfer-moerel" | "bergführer-tag" | "raclette-abend";

export type FlowState = {
  step: Step;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;

  rooms: RoomOption[];
  selectedRoomSlug: string | null;

  extras: Record<string, number>; // slug → qty

  details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  marketingConsent: boolean;

  loading: boolean;
  error: string | null;
};

export type FlowAction =
  | { type: "SET_DATES"; checkIn: string; checkOut: string; adults: number; children: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_ROOMS"; rooms: RoomOption[] }
  | { type: "SET_STEP"; step: Step }
  | { type: "SELECT_ROOM"; slug: string }
  | { type: "SET_EXTRA"; slug: string; quantity: number }
  | { type: "SET_DETAILS"; details: Partial<FlowState["details"]> }
  | { type: "SET_MARKETING_CONSENT"; value: boolean };

export const initialState: FlowState = {
  step: "dates",
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  rooms: [],
  selectedRoomSlug: null,
  extras: {},
  details: { name: "", email: "", phone: "", notes: "" },
  marketingConsent: false,
  loading: false,
  error: null,
};

export function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SET_DATES":
      return {
        ...state,
        checkIn: action.checkIn,
        checkOut: action.checkOut,
        adults: action.adults,
        children: action.children,
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_ROOMS":
      return { ...state, rooms: action.rooms };
    case "SET_STEP":
      return { ...state, step: action.step, error: null };
    case "SELECT_ROOM":
      return { ...state, selectedRoomSlug: action.slug };
    case "SET_EXTRA":
      return {
        ...state,
        extras: { ...state.extras, [action.slug]: Math.max(0, action.quantity) },
      };
    case "SET_DETAILS":
      return { ...state, details: { ...state.details, ...action.details } };
    case "SET_MARKETING_CONSENT":
      return { ...state, marketingConsent: action.value };
  }
}
