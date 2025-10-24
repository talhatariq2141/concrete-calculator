"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface EEATBlockProps {
  /** Name of the professional reviewer */
  reviewerName: string;
  /** Professional license or registration number (e.g., PEC, PE, etc.) */
  licenseNumber: string;
  /** Date of last update in ISO or readable format */
  lastUpdated: string;
}

/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) Block
 * Displays an "Expert Review" line below the calculator H1 title.
 */
const EEATBlock: React.FC<EEATBlockProps> = ({
  reviewerName,
  licenseNumber,
  lastUpdated,
}) => {
  return (
    <div className="ml-2 mt-5 mb-4 flex items-center gap-2 text-sm text-slate-400 font-poppins">
      <ShieldCheck className="h-4 w-4 text-teal-400 flex-shrink-0" aria-hidden="true" />
      <p>
        <span className="text-slate-300 font-medium">Reviewed by</span>{" "}
        <span className="text-slate-200 font-semibold">{reviewerName}</span> |{" "}
        <span className="text-slate-300">PEC License #: {licenseNumber}</span> |{" "}
        <span className="text-slate-500">
          Last updated: {lastUpdated}
        </span>
      </p>
    </div>
  );
};

export default EEATBlock;
