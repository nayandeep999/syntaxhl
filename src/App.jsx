import { Resizable } from "re-resizable";
import { useEffect, useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import BackgroundSwitch from "./components/controls/BackgroundSwitch";
import DarkModeSwitch from "./components/controls/DarkModeSwitch";
import ExportOptions from "./components/controls/ExportOptions";
import FontSelect from "./components/controls/FontSelect";
import FontSizeInput from "./components/controls/FontSizeInput";
import LanguageSelect from "./components/controls/LanguageSelect";
import PaddingSlider from "./components/controls/PaddingSlider";
import ThemeSelect from "./components/controls/ThemeSelect";
import { Card, CardContent } from "./components/ui/card";
import { cn } from "./lib/utils";
import { fonts, themes } from "./options";
import useStore from "./store";

function App() {
  const theme = useStore((state) => state.theme);
  const padding = useStore((state) => state.padding);
  const fontStyle = useStore((state) => state.fontStyle);
  const showBackground = useStore((state) => state.showBackground);

  const editorRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size === 0) return;
    const state = Object.fromEntries(queryParams);

    useStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    });
  }, []);

  return (
    <main className="dark min-h-screen flex justify-center items-center bg-neutral-950 text-white">
      <link
        rel="stylesheet"
        href={themes[theme].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle].src}
        crossOrigin="anonymous"
      />
      <div className="hidden sm:block">
        {/* Only show Resizable on medium and up */}
        <Resizable
          enable={{ left: true, right: true }}
          minWidth={padding * 2 + 400}
          maxWidth={640}
        >
          <div
            className={cn(
              "overflow-hidden mb-2 transition-all ease-out",
              showBackground ? themes[theme].background : ""
            )}
            style={{ padding }}
            ref={editorRef}
          >
            <CodeEditor />
          </div>
        </Resizable>
      </div>
      <div className="block sm:hidden">
        {/* Optionally render a different component on small screens */}
        <div
          className={cn(
            "overflow-hidden mb-2 transition-all ease-out",
            showBackground ? themes[theme].background : ""
          )}
          style={{ padding }}
          ref={editorRef}
        >
          <CodeEditor />
        </div>
      </div>
      <Card className="fixed bottom-0 sm:bottom-5 py-6 px-4 mx-6 bg-neutral-900/90 backdrop-blur w-full max-w-fit overflow-x-auto">
        <CardContent className="flex flex-nowrap md:flex-wrap items-center gap-6 p-0">
          <ThemeSelect />
          <LanguageSelect />
          <FontSelect />
          <FontSizeInput />
          <PaddingSlider />
          <BackgroundSwitch />
          <DarkModeSwitch />
          <div className="sm-block w-px h-10 bg-neutral-800" />
          <div className="place-self-center">
            <ExportOptions targetRef={editorRef} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
