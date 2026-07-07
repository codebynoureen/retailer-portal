import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";

export function ok<T>(data: T, message = "Success") {
  return NextResponse.json({ data, error: null, message });
}

export function fail(error: unknown, fallbackMessage = "Something went wrong") {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { data: null, error: error.message, message: error.message },
      { status: error.status }
    );
  }
  console.error(error);
  return NextResponse.json(
    { data: null, error: fallbackMessage, message: fallbackMessage },
    { status: 500 }
  );
}