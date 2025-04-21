"use client";
import { createContext, useContext } from "react";

export const SubCategoryContext = createContext<any[]>([]);

export const useSubCategories = () => useContext(SubCategoryContext);
