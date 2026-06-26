"use client";

import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType = "multiple" | "bash" | "js" | "css" | "code";

export interface MultipleChoiceQuestion {
  type: "multiple";
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
}

export interface CodeQuestion {
  type: Exclude<QuestionType, "multiple">;
  question: string;
  expectedAnswer: string;
  hint?: string;
  explanation?: string;
  language?: string;
}

export type Question = MultipleChoiceQuestion | CodeQuestion;

export interface QuizProps {
  questions?: Question[];
  title?: string;
  showVimToggle?: boolean;
  pass?: number;
}

type VimMode = "normal" | "insert";
type Answers = Record<number, number | string>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeCode(str = ""): string {
  return str.trim().replace(/\s+/g, " ").toLowerCase();
}

function isAnswerCorrect(q: Question, a: number | string | undefined): boolean {
  if (a === undefined || a === null || a === "") return false;
  if (q.type === "multiple") return (a as number) === q.correctIndex;
  return (
    normalizeCode(a as string) ===
    normalizeCode((q as CodeQuestion).expectedAnswer)
  );
}

// ─── Theme tokens (pulled from global.css fd- variables) ─────────────────────

const T = {
  // light
  bg: "hsl(40,8%,97%)",
  card: "hsl(36,6%,94%)",
  muted: "hsl(36,6%,93%)",
  border: "hsla(33,8%,72%,55%)",
  fg: "hsl(30,5%,11%)",
  fgMuted: "hsl(30,4%,44%)",
  primary: "hsl(152,100%,38%)", // green
  primaryFg: "#fff",
  accent: "hsla(152,100%,38%,10%)",
  accentFg: "hsl(152,100%,32%)",
  violet: "hsl(250,85%,58%)",
  violetBg: "hsla(250,85%,67%,10%)",
  violetBorder: "hsl(250,85%,67%)",
  success: "hsl(142,70%,45%)",
  successBg: "hsla(142,70%,45%,10%)",
  successBorder: "hsl(142,70%,45%)",
  danger: "hsl(0,84%,60%)",
  dangerBg: "hsla(0,84%,60%,10%)",
  dangerBorder: "hsl(0,84%,60%)",
  warn: "hsl(38,92%,50%)",
  warnBg: "hsla(38,92%,50%,10%)",
  warnBorder: "hsl(38,92%,50%)",
} as const;

// ─── CodeMirror light theme matching the docs ─────────────────────────────────

const docsLightTheme = createTheme({
  theme: "light",
  settings: {
    background: "hsl(36,6%,94%)",
    backgroundImage: "",
    foreground: "hsl(30,5%,11%)",
    caret: "hsl(152,100%,38%)",
    selection: "hsla(250,85%,67%,20%)",
    selectionMatch: "hsla(250,85%,67%,12%)",
    lineHighlight: "hsla(33,8%,72%,20%)",
    gutterBackground: "hsl(36,6%,93%)",
    gutterForeground: "hsl(30,4%,44%)",
    gutterBorder: "hsla(33,8%,72%,55%)",
    gutterActiveForeground: "hsl(152,100%,32%)",
  },
  styles: [
    { tag: t.comment, color: "hsl(30,4%,55%)", fontStyle: "italic" },
    { tag: t.keyword, color: "hsl(250,85%,52%)", fontWeight: "600" },
    { tag: t.string, color: "hsl(142,60%,35%)" },
    { tag: t.number, color: "hsl(20,90%,48%)" },
    { tag: t.operator, color: "hsl(250,85%,52%)" },
    { tag: t.variableName, color: "hsl(30,5%,11%)" },
    { tag: t.function(t.variableName), color: "hsl(152,100%,30%)" },
    { tag: t.typeName, color: "hsl(250,85%,52%)" },
    { tag: t.propertyName, color: "hsl(30,5%,22%)" },
    { tag: t.punctuation, color: "hsl(30,4%,44%)" },
    { tag: t.meta, color: "hsl(142,60%,35%)" },
    { tag: t.bool, color: "hsl(250,85%,52%)", fontWeight: "600" },
    { tag: t.null, color: "hsl(250,85%,52%)" },
    { tag: t.className, color: "hsl(38,92%,40%)" },
    { tag: t.definition(t.variableName), color: "hsl(152,100%,30%)" },
    { tag: t.atom, color: "hsl(20,90%,48%)" },
    { tag: t.tagName, color: "hsl(152,100%,30%)" },
    { tag: t.attributeName, color: "hsl(250,85%,52%)" },
  ],
});

// ─── Lang helper ──────────────────────────────────────────────────────────────

function getLang(type: QuestionType, language?: string) {
  const l = language ?? type;
  if (l === "js" || l === "javascript" || l === "ts" || l === "typescript")
    return javascript({ typescript: l.startsWith("t") });
  if (l === "css") return css();
  return css(); // bash / sh / code
}

const TYPE_META: Record<
  QuestionType,
  { label: string; color: string; bg: string; border: string }
> = {
  multiple: {
    label: "Multiple choice",
    color: T.violetBorder,
    bg: T.violetBg,
    border: T.violetBorder,
  },
  bash: { label: "Bash", color: T.warn, bg: T.warnBg, border: T.warnBorder },
  js: {
    label: "JavaScript",
    color: T.warn,
    bg: T.warnBg,
    border: T.warnBorder,
  },
  css: {
    label: "CSS",
    color: T.success,
    bg: T.successBg,
    border: T.successBorder,
  },
  code: {
    label: "Code",
    color: T.violet,
    bg: T.violetBg,
    border: T.violetBorder,
  },
};

// ─── useVimEditor ─────────────────────────────────────────────────────────────
// (only used for the textarea fallback — CodeMirror has its own vim extension
//  but to keep bundle size down we replicate the key logic manually)

function useVimBindings(
  editorRef: React.MutableRefObject<EditorView | null>,
  enabled: boolean,
) {
  const [mode, setMode] = useState<VimMode>("normal");
  const modeRef = useRef<VimMode>("normal");

  useEffect(() => {
    if (!enabled) return;
    const view = editorRef.current;
    if (!view) return;

    // We use a simple overlay keydown listener on the CM dom element
    const dom = view.dom;

    function onKey(e: globalThis.KeyboardEvent) {
      if (!enabled) return;
      const cur = modeRef.current;

      if (cur === "insert") {
        if (e.key === "Escape") {
          e.preventDefault();
          modeRef.current = "normal";
          setMode("normal");
        }
        return;
      }

      // Normal mode — basic vim motions forwarded to CM API
      const { state, dispatch } = view;
      const pos = state.selection.main.head;
      const doc = state.doc;

      const lineObj = doc.lineAt(pos);
      const lineNum = lineObj.number;
      const col = pos - lineObj.from;

      const move = (newPos: number) => {
        e.preventDefault();
        dispatch({ selection: { anchor: newPos } });
      };

      if (e.key === "i") {
        e.preventDefault();
        modeRef.current = "insert";
        setMode("insert");
        return;
      }
      if (e.key === "a") {
        e.preventDefault();
        modeRef.current = "insert";
        setMode("insert");
        move(Math.min(pos + 1, lineObj.to));
        return;
      }
      if (e.key === "I") {
        e.preventDefault();
        modeRef.current = "insert";
        setMode("insert");
        move(lineObj.from);
        return;
      }
      if (e.key === "A") {
        e.preventDefault();
        modeRef.current = "insert";
        setMode("insert");
        move(lineObj.to);
        return;
      }

      if (e.key === "h") {
        move(Math.max(lineObj.from, pos - 1));
        return;
      }
      if (e.key === "l") {
        move(Math.min(lineObj.to, pos + 1));
        return;
      }
      if (e.key === "j") {
        if (lineNum < doc.lines) {
          const nextLine = doc.line(lineNum + 1);
          move(Math.min(nextLine.from + col, nextLine.to));
        } else {
          e.preventDefault();
        }
        return;
      }
      if (e.key === "k") {
        if (lineNum > 1) {
          const prevLine = doc.line(lineNum - 1);
          move(Math.min(prevLine.from + col, prevLine.to));
        } else {
          e.preventDefault();
        }
        return;
      }
      if (e.key === "0") {
        move(lineObj.from);
        return;
      }
      if (e.key === "$") {
        move(lineObj.to);
        return;
      }
      if (e.key === "G") {
        move(doc.length);
        return;
      }
      if (e.key === "x") {
        e.preventDefault();
        if (pos < lineObj.to) {
          dispatch(state.update({ changes: { from: pos, to: pos + 1 } }));
        }
        return;
      }
      if (e.key === "w") {
        e.preventDefault();
        const text = doc.sliceString(pos, lineObj.to);
        const m = text.match(/^\W*\w+/);
        if (m) move(pos + m[0].length);
        return;
      }
      if (e.key === "b") {
        e.preventDefault();
        const text = doc.sliceString(lineObj.from, pos);
        const m = text.match(/\w+\W*$/);
        if (m) move(pos - m[0].length);
        return;
      }
      if (e.key === "o") {
        e.preventDefault();
        modeRef.current = "insert";
        setMode("insert");
        dispatch(
          state.update({
            changes: { from: lineObj.to, to: lineObj.to, insert: "\n" },
            selection: { anchor: lineObj.to + 1 },
          }),
        );
        return;
      }
      if (e.key === "O") {
        e.preventDefault();
        modeRef.current = "insert";
        setMode("insert");
        dispatch(
          state.update({
            changes: { from: lineObj.from, to: lineObj.from, insert: "\n" },
            selection: { anchor: lineObj.from },
          }),
        );
        return;
      }
      e.preventDefault();
    }

    dom.addEventListener("keydown", onKey);
    return () => dom.removeEventListener("keydown", onKey);
  }, [enabled, editorRef]);

  return mode;
}

// ─── CodeEditor using CodeMirror ─────────────────────────────────────────────

interface CodeEditorProps {
  value: string;
  onChange?: (v: string) => void;
  type: QuestionType;
  language?: string;
  readOnly?: boolean;
  vimEnabled?: boolean;
  isDark?: boolean;
  minHeight?: string;
}

function CodeEditor({
  value,
  onChange,
  type,
  language,
  readOnly = false,
  vimEnabled = false,
  isDark = false,
  minHeight = "80px",
}: CodeEditorProps) {
  const editorRef = useRef<EditorView | null>(null);
  const vimMode = useVimBindings(editorRef, vimEnabled && !readOnly);
  const lang = getLang(type, language);

  const baseTheme = EditorView.theme({
    "&": {
      fontSize: "13px",
      fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
    },
    ".cm-editor": { borderRadius: "0" },
    ".cm-focused": { outline: "none" },
    ".cm-scroller": { fontFamily: "inherit", lineHeight: "1.65", minHeight },
    ".cm-line": { padding: "0 12px" },
    ".cm-gutters": { minWidth: "36px", paddingRight: "4px" },
    ".cm-cursor": { borderLeftWidth: "2px" },
  });

  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        overflow: "hidden",
        background: isDark ? "hsl(240,10%,6%)" : T.card,
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 12px",
          borderBottom: `1px solid ${T.border}`,
          background: isDark ? "hsl(240,10%,4%)" : T.muted,
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* traffic-light dots */}
          {(
            ["hsl(0,84%,60%)", "hsl(38,92%,50%)", "hsl(142,70%,45%)"] as const
          ).map((c, i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
                display: "inline-block",
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 11,
            color: T.fgMuted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {language ?? type}
        </span>
        {vimEnabled && !readOnly && (
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 4,
              fontWeight: 600,
              fontFamily: "monospace",
              background: vimMode === "insert" ? T.successBg : T.violetBg,
              color: vimMode === "insert" ? T.success : T.violetBorder,
              border: `1px solid ${vimMode === "insert" ? T.successBorder : T.violetBorder}`,
            }}
          >
            {vimMode === "insert" ? "INSERT" : "NORMAL"}
          </span>
        )}
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[lang, baseTheme]}
        theme={isDark ? oneDark : docsLightTheme}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          autocompletion: !readOnly,
          tabSize: 2,
        }}
        onCreateEditor={(view) => {
          editorRef.current = view;
        }}
      />
    </div>
  );
}

// ─── MultipleChoice ───────────────────────────────────────────────────────────

const LETTERS = ["A", "B", "C", "D"] as const;

interface MCProps {
  question: MultipleChoiceQuestion;
  answer: number | undefined;
  onAnswer: (i: number) => void;
  submitted: boolean;
}

function MultipleChoice({ question, answer, onAnswer, submitted }: MCProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt, i) => {
        const selected = answer === i;
        const isCorrect = i === question.correctIndex;
        const wrongPicked = submitted && selected && !isCorrect;
        const rightPicked = submitted && isCorrect;

        let bg = "var(--color-fd-card)";
        let border = "var(--color-fd-border)";
        let fg = "var(--color-fd-foreground)";
        let pillBg = "var(--color-fd-muted)";
        let pillFg = "var(--color-fd-muted-foreground)";

        if (!submitted && selected) {
          bg = T.violetBg;
          border = T.violetBorder;
          fg = T.violet;
          pillBg = T.violetBg;
          pillFg = T.violetBorder;
        } else if (rightPicked) {
          bg = T.successBg;
          border = T.successBorder;
          fg = T.success;
          pillBg = T.successBg;
          pillFg = T.success;
        } else if (wrongPicked) {
          bg = T.dangerBg;
          border = T.dangerBorder;
          fg = T.danger;
          pillBg = T.dangerBg;
          pillFg = T.danger;
        } else if (submitted && isCorrect) {
          // show correct even if not selected
          bg = T.successBg;
          border = T.successBorder;
          fg = T.success;
          pillBg = T.successBg;
          pillFg = T.success;
        }

        const icon =
          submitted && isCorrect
            ? "✓"
            : submitted && wrongPicked
              ? "✗"
              : LETTERS[i];

        return (
          <button
            key={i}
            disabled={submitted}
            onClick={() => !submitted && onAnswer(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              border: `1.5px solid ${border}`,
              borderRadius: 10,
              background: bg,
              cursor: submitted ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.18s ease",
              width: "100%",
              boxShadow:
                !submitted && selected
                  ? `0 0 0 3px ${T.violetBg}, 0 2px 8px hsla(250,85%,67%,15%)`
                  : "none",
            }}
          >
            {/* Letter pill */}
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: pillBg,
                color: pillFg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                border: `1px solid ${border}`,
                transition: "all 0.18s ease",
                fontFamily: "monospace",
              }}
            >
              {icon}
            </span>
            <span style={{ fontSize: 14, color: fg, lineHeight: 1.5, flex: 1 }}>
              {opt}
            </span>
            {/* Radio dot */}
            {!submitted && (
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${selected ? T.violetBorder : T.border}`,
                  background: selected ? T.violetBorder : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                }}
              >
                {selected && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                )}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

interface QCardProps {
  question: Question;
  index: number;
  answer: number | string | undefined;
  onAnswer: (v: number | string) => void;
  submitted: boolean;
  vimEnabled: boolean;
  isDark: boolean;
}

function QuestionCard({
  question,
  index,
  answer,
  onAnswer,
  submitted,
  vimEnabled,
  isDark,
}: QCardProps) {
  const meta = TYPE_META[question.type] ?? TYPE_META.code;
  const correct = submitted && isAnswerCorrect(question, answer);
  const wrong = submitted && !correct;

  return (
    <div
      style={{
        background: "var(--color-fd-card)",
        border: `1px solid ${submitted ? (correct ? T.successBorder : T.dangerBorder) : T.border}`,
        borderRadius: 12,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Index bubble */}
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: submitted
              ? correct
                ? T.successBg
                : T.dangerBg
              : T.violetBg,
            border: `1px solid ${submitted ? (correct ? T.successBorder : T.dangerBorder) : T.violetBorder}`,
            color: submitted ? (correct ? T.success : T.danger) : T.violet,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
            fontFamily: "monospace",
          }}
        >
          {submitted ? (correct ? "✓" : "✗") : index + 1}
        </span>

        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 500,
              color: "var(--color-fd-foreground)",
              lineHeight: 1.55,
            }}
          >
            {question.question}
          </p>
        </div>

        {/* Type badge */}
        <span
          style={{
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 20,
            background: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.border}`,
            whiteSpace: "nowrap",
            fontWeight: 600,
            letterSpacing: "0.03em",
            flexShrink: 0,
          }}
        >
          {meta.label}
        </span>
      </div>

      {/* Body */}
      {question.type === "multiple" ? (
        <MultipleChoice
          question={question}
          answer={answer as number | undefined}
          onAnswer={(i) => onAnswer(i)}
          submitted={submitted}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.hint && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "8px 12px",
                background: T.warnBg,
                border: `1px solid ${T.warnBorder}`,
                borderRadius: 8,
                fontSize: 13,
                color: T.warn,
              }}
            >
              <span style={{ flexShrink: 0, marginTop: 1 }}>💡</span>
              <span>{question.hint}</span>
            </div>
          )}
          <CodeEditor
            value={(answer as string) ?? ""}
            onChange={(v) => onAnswer(v)}
            type={question.type}
            language={question.language}
            readOnly={submitted}
            vimEnabled={vimEnabled}
            isDark={isDark}
          />
          {submitted && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: T.fgMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Expected answer
              </p>
              <CodeEditor
                value={(question as CodeQuestion).expectedAnswer}
                type={question.type}
                language={question.language}
                readOnly
                isDark={isDark}
              />
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {submitted && question.explanation && (
        <div
          style={{
            padding: "10px 14px",
            background: T.violetBg,
            borderRadius: 8,
            borderLeft: `3px solid ${T.violetBorder}`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--color-fd-foreground)",
              lineHeight: 1.65,
            }}
          >
            <strong style={{ color: T.violet }}>Explanation: </strong>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Result Popup ─────────────────────────────────────────────────────────────

interface ResultPopupProps {
  score: number;
  total: number;
  questions: Question[];
  answers: Answers;
  pass: number;
  onClose: () => void;
  onRetry: () => void;
}

function ResultPopup({
  score,
  total,
  questions,
  answers,
  pass,
  onClose,
  onRetry,
}: ResultPopupProps) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= pass;

  // Close on backdrop click
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const circumference = 2 * Math.PI * 36; // r=36
  const dash = (pct / 100) * circumference;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "hsla(240,10%,3.9%,0.6)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "quiz-fade-in 0.2s ease",
      }}
    >
      <style>{`
        @keyframes quiz-fade-in  { from { opacity:0; transform:scale(.96) } to { opacity:1; transform:scale(1) } }
        @keyframes quiz-dash-anim{ from { stroke-dashoffset:${circumference} } to { stroke-dashoffset:${circumference - dash} } }
      `}</style>

      <div
        style={{
          background: "var(--color-fd-background)",
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          padding: "2rem",
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 24px 60px -12px hsla(240,10%,3.9%,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          animation: "quiz-fade-in 0.22s ease",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute" as const,
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.fgMuted,
            fontSize: 20,
            lineHeight: 1,
            padding: "4px 8px",
            borderRadius: 6,
          }}
        >
          ×
        </button>

        {/* Ring */}
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke={passed ? T.successBg : T.dangerBg}
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke={passed ? T.success : T.danger}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - dash}
              style={{ animation: `quiz-dash-anim 0.8s 0.1s ease forwards` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: passed ? T.success : T.danger,
                lineHeight: 1,
              }}
            >
              {pct}%
            </span>
            <span style={{ fontSize: 11, color: T.fgMuted, marginTop: 2 }}>
              score
            </span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "var(--color-fd-foreground)",
            }}
          >
            {passed ? "Well done! 🎉" : "Keep studying 📚"}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: T.fgMuted }}>
            {score} of {total} correct · pass at {pass}%
          </p>
        </div>

        {/* Per-question dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {questions.map((q, i) => {
            const c = isAnswerCorrect(q, answers[i]);
            return (
              <div
                key={i}
                title={`Q${i + 1}: ${c ? "correct" : "wrong"}`}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c ? T.successBg : T.dangerBg,
                  border: `1px solid ${c ? T.successBorder : T.dangerBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: c ? T.success : T.danger,
                  fontFamily: "monospace",
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: 6,
            borderRadius: 99,
            background: "var(--color-fd-muted)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 99,
              background: passed ? T.success : T.danger,
              transition: "width 0.8s ease 0.1s",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: "var(--color-fd-card)",
              color: "var(--color-fd-foreground)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Review answers
          </button>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: `1px solid ${T.primary}`,
              background: T.primary,
              color: T.primaryFg,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export default function Quiz({
  questions = [],
  title = "Quick quiz",
  showVimToggle = true,
  pass = 70,
}: QuizProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [vimEnabled, setVimEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode from the .dark class on <html>
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const hasCode = questions.some((q) => q.type !== "multiple");
  const answeredCount = Object.values(answers).filter(
    (v) => v !== undefined && v !== null && v !== "",
  ).length;

  const score = submitted
    ? questions.reduce(
        (acc, q, i) => (isAnswerCorrect(q, answers[i]) ? acc + 1 : acc),
        0,
      )
    : 0;

  function handleSubmit() {
    setSubmitted(true);
    setShowPopup(true);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setShowPopup(false);
  }

  if (!questions.length) {
    return (
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: 10,
          background: T.warnBg,
          border: `1px solid ${T.warnBorder}`,
          color: T.warn,
          fontSize: 14,
        }}
      >
        No questions provided. Pass a <code>questions</code> prop.
      </div>
    );
  }

  return (
    <>
      {showPopup && submitted && (
        <ResultPopup
          score={score}
          total={questions.length}
          questions={questions}
          answers={answers}
          pass={pass}
          onClose={() => setShowPopup(false)}
          onRetry={handleRetry}
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          padding: "0.25rem 0 1rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            paddingBottom: "1rem",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "var(--color-fd-foreground)",
                fontFamily: "Playwrite, Inter, sans-serif",
              }}
            >
              {title}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: T.fgMuted }}>
              {questions.length} question{questions.length !== 1 ? "s" : ""} ·
              pass at {pass}%
              {submitted && (
                <span
                  style={{
                    marginLeft: 10,
                    padding: "2px 10px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      score / questions.length >= pass / 100
                        ? T.successBg
                        : T.dangerBg,
                    color:
                      score / questions.length >= pass / 100
                        ? T.success
                        : T.danger,
                    border: `1px solid ${score / questions.length >= pass / 100 ? T.successBorder : T.dangerBorder}`,
                  }}
                >
                  {score}/{questions.length} correct
                </span>
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Vim toggle */}
            {hasCode && showVimToggle && (
              <button
                onClick={() => setVimEnabled((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: `1px solid ${vimEnabled ? T.violetBorder : T.border}`,
                  background: vimEnabled ? T.violetBg : "var(--color-fd-card)",
                  color: vimEnabled ? T.violet : T.fgMuted,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "monospace",
                }}
              >
                ⌨ {vimEnabled ? "Vim on" : "Vim off"}
              </button>
            )}

            {/* Progress pill */}
            {!submitted && (
              <span
                style={{
                  fontSize: 13,
                  color:
                    answeredCount === questions.length ? T.success : T.fgMuted,
                  fontWeight: answeredCount === questions.length ? 600 : 400,
                  transition: "color 0.2s ease",
                }}
              >
                {answeredCount}/{questions.length}
              </span>
            )}
          </div>
        </div>

        {/* Vim hint */}
        {vimEnabled && (
          <div
            style={{
              padding: "8px 14px",
              background: T.violetBg,
              borderRadius: 8,
              border: `1px solid ${T.violetBorder}`,
              fontSize: 12,
              color: T.violet,
              fontFamily: "monospace",
              lineHeight: 1.7,
            }}
          >
            <strong>Vim motions: </strong>i insert · Esc normal · hjkl move ·
            w/b word · 0/$ line · o/O new line · x delete char · gg/G top/bottom
          </div>
        )}

        {/* Questions */}
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            question={q}
            index={i}
            answer={answers[i]}
            onAnswer={(val) => setAnswers((prev) => ({ ...prev, [i]: val }))}
            submitted={submitted}
            vimEnabled={vimEnabled}
            isDark={isDark}
          />
        ))}

        {/* Submit / Retry */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {submitted ? (
            <>
              <button
                onClick={() => setShowPopup(true)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: `1px solid ${T.violetBorder}`,
                  background: T.violetBg,
                  color: T.violet,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                See results
              </button>
              <button
                onClick={handleRetry}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: `1px solid ${T.primary}`,
                  background: T.primary,
                  color: T.primaryFg,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              style={{
                padding: "10px 28px",
                borderRadius: 10,
                border: `1px solid ${answeredCount > 0 ? T.primary : T.border}`,
                background:
                  answeredCount > 0 ? T.primary : "var(--color-fd-muted)",
                color: answeredCount > 0 ? T.primaryFg : T.fgMuted,
                fontSize: 14,
                fontWeight: 600,
                cursor: answeredCount === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Submit answers →
            </button>
          )}
        </div>
      </div>
    </>
  );
}
