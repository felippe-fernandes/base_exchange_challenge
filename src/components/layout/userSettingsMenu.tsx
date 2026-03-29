"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CURRENCIES,
  DATE_FORMAT_OPTIONS,
  THEME_OPTIONS,
  TIME_FORMAT_OPTIONS,
} from "@/lib/constants";
import type { DateFormat, TimeFormat, UserTheme } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "@/stores/userConfigStore";

export function UserSettingsMenu() {
  const theme = useUserConfigStore((state) => state.theme);
  const preferredCurrency = useUserConfigStore((state) => state.preferredCurrency);
  const dateFormat = useUserConfigStore((state) => state.dateFormat);
  const timeFormat = useUserConfigStore((state) => state.timeFormat);
  const setTheme = useUserConfigStore((state) => state.setTheme);
  const setPreferredCurrency = useUserConfigStore((state) => state.setPreferredCurrency);
  const setDateFormat = useUserConfigStore((state) => state.setDateFormat);
  const setTimeFormat = useUserConfigStore((state) => state.setTimeFormat);
  const selectedThemeLabel =
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;
  const selectedDateFormatLabel =
    DATE_FORMAT_OPTIONS.find((option) => option.value === dateFormat)?.label ?? dateFormat;
  const selectedTimeFormatLabel =
    TIME_FORMAT_OPTIONS.find((option) => option.value === timeFormat)?.label ?? timeFormat;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            <Settings2 className="size-4" />
            Settings
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-72 p-3">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Theme</p>
            <Select value={theme} onValueChange={(value) => setTheme(value as UserTheme)}>
              <SelectTrigger className="w-full">
                <SelectValue>{selectedThemeLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Preferred currency</p>
            <Select value={preferredCurrency} onValueChange={setPreferredCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue>{preferredCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Date format</p>
            <Select value={dateFormat} onValueChange={(value) => setDateFormat(value as DateFormat)}>
              <SelectTrigger className="w-full">
                <SelectValue>{selectedDateFormatLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Time format</p>
            <Select value={timeFormat} onValueChange={(value) => setTimeFormat(value as TimeFormat)}>
              <SelectTrigger className="w-full">
                <SelectValue>{selectedTimeFormatLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TIME_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
