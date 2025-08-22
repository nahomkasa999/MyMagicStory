export interface PDFViewerProps {
  pdfPath: string;
  className?: string;
}

export interface PDFViewerState {
  isLoading: boolean;
  error: string | null;
  numPages: number | null;
  currentPage: number;
}