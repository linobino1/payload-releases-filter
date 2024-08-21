import React from "react";
import { format as formatDate, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

type Props = {
  iso: string;
  format?: string;
  className?: string;
};

export const Date: React.FC<Props> = ({ iso, className, format }) => {
  const date = parseISO(iso ?? "");
  const locale = enUS;
  if (!date || isNaN(date.getMilliseconds())) {
    console.log("encountered invalid date", iso);
    return <></>;
  }
  const str = formatDate(date, format ?? "LLLL d, yyyy", { locale });

  return (
    <time suppressHydrationWarning className={className} dateTime={iso}>
      {str}
    </time>
  );
};

export default Date;
