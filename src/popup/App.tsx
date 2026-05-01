import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Slider,
  Stack,
  Switch,
  Text
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import SiteStatusCard from "./components/SiteStatusCard";
import type { ExtensionSettings, SiteStatus } from "../shared/types";
import { DEFAULT_SETTINGS } from "../shared/types";

type Mode = "whitelist" | "blacklist";

async function getActiveHostname(): Promise<string | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) {
    return null;
  }
  try {
    return new URL(tab.url).hostname;
  } catch {
    return null;
  }
}

export default function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [siteStatus, setSiteStatus] = useState<SiteStatus | null>(null);
  const [activeHostname, setActiveHostname] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("blacklist");
  const [newDomain, setNewDomain] = useState("");

  async function refresh() {
    const loaded = (await chrome.runtime.sendMessage({
      type: "GET_SETTINGS"
    })) as ExtensionSettings;
    setSettings(loaded);

    const hostname = await getActiveHostname();
    setActiveHostname(hostname);

    if (!hostname) {
      setSiteStatus(null);
      return;
    }

    const status = (await chrome.runtime.sendMessage({
      type: "GET_SITE_STATUS",
      payload: { hostname }
    })) as SiteStatus;
    setSiteStatus(status);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const currentList = useMemo(() => settings[mode], [mode, settings]);

  async function pushAndRefresh(message: object) {
    await chrome.runtime.sendMessage(message);
    await chrome.runtime.sendMessage({ type: "APPLY_SETTINGS_TO_ACTIVE_TAB" });
    await refresh();
  }

  async function persistVisual(brightness: number, contrast: number) {
    setSettings((prev) => ({
      ...prev,
      visual: { brightness, contrast }
    }));
    await chrome.runtime.sendMessage({
      type: "SET_VISUAL",
      payload: { brightness, contrast }
    });
    await chrome.runtime.sendMessage({ type: "APPLY_SETTINGS_TO_ACTIVE_TAB" });
  }

  return (
    <Container minW="360px" py={4}>
      <Stack gap={4}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md">ShadowSurf</Heading>
            <Text fontSize="xs" opacity={0.75}>
              Modern dark mode for any site
            </Text>
          </Box>
          <Switch.Root
            checked={settings.globalEnabled}
            onCheckedChange={({ checked }) =>
              void pushAndRefresh({ type: "SET_GLOBAL_ENABLED", payload: checked })
            }
          >
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>
        </Flex>

        <SiteStatusCard
          siteStatus={siteStatus}
          onToggleSite={(enabled) => {
            if (!activeHostname) {
              return;
            }
            void pushAndRefresh({
              type: "TOGGLE_SITE",
              payload: { hostname: activeHostname, enabled }
            });
          }}
        />

        <Box borderWidth="1px" borderRadius="md" p={3}>
          <Text fontWeight="semibold" mb={2}>
            Visual tuning
          </Text>
          <Text fontSize="xs" opacity={0.8}>
            Brightness: {settings.visual.brightness}%
          </Text>
          <Slider.Root
            value={[settings.visual.brightness]}
            min={60}
            max={120}
            step={1}
            onValueChange={({ value }) =>
              setSettings((prev) => ({
                ...prev,
                visual: {
                  ...prev.visual,
                  brightness: value[0]
                }
              }))
            }
            onValueChangeEnd={({ value }) =>
              void persistVisual(value[0], settings.visual.contrast)
            }
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>

          <Text mt={3} fontSize="xs" opacity={0.8}>
            Contrast: {settings.visual.contrast}%
          </Text>
          <Slider.Root
            value={[settings.visual.contrast]}
            min={70}
            max={130}
            step={1}
            onValueChange={({ value }) =>
              setSettings((prev) => ({
                ...prev,
                visual: {
                  ...prev.visual,
                  contrast: value[0]
                }
              }))
            }
            onValueChangeEnd={({ value }) =>
              void persistVisual(settings.visual.brightness, value[0])
            }
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
        </Box>

        <Box borderWidth="1px" borderRadius="md" p={3}>
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="semibold">Domain rules</Text>
            <HStack gap={1}>
              <Button size="xs" variant={mode === "whitelist" ? "solid" : "outline"} onClick={() => setMode("whitelist")}>
                Whitelist
              </Button>
              <Button size="xs" variant={mode === "blacklist" ? "solid" : "outline"} onClick={() => setMode("blacklist")}>
                Blacklist
              </Button>
            </HStack>
          </HStack>
          <HStack>
            <Input
              size="sm"
              placeholder="example.com"
              value={newDomain}
              onChange={(event) => setNewDomain(event.target.value)}
            />
            <Button
              size="sm"
              onClick={() => {
                if (!newDomain.trim()) {
                  return;
                }
                void pushAndRefresh({
                  type: "ADD_DOMAIN_RULE",
                  payload: { mode, domain: newDomain }
                });
                setNewDomain("");
              }}
            >
              Add
            </Button>
          </HStack>
          <Stack mt={2} gap={1}>
            {currentList.map((domain) => (
              <HStack key={`${mode}-${domain}`} justify="space-between">
                <Text fontSize="sm">{domain}</Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() =>
                    void pushAndRefresh({
                      type: "REMOVE_DOMAIN_RULE",
                      payload: { mode, domain }
                    })
                  }
                >
                  Remove
                </Button>
              </HStack>
            ))}
            {currentList.length === 0 ? (
              <Text fontSize="xs" opacity={0.75}>
                No domains in {mode}.
              </Text>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
