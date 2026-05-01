import { Badge, Box, Button, HStack, Text } from "@chakra-ui/react";
import type { SiteStatus } from "../../shared/types";

interface SiteStatusCardProps {
  siteStatus: SiteStatus | null;
  onToggleSite(nextEnabled: boolean): void;
}

export default function SiteStatusCard({ siteStatus, onToggleSite }: SiteStatusCardProps) {
  if (!siteStatus) {
    return (
      <Box borderWidth="1px" borderRadius="md" p={3}>
        <Text fontSize="sm">Open a normal web page tab to manage this site.</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="semibold">{siteStatus.hostname}</Text>
        <Badge colorPalette={siteStatus.enabled ? "green" : "red"}>
          {siteStatus.enabled ? "Enabled" : "Disabled"}
        </Badge>
      </HStack>
      <Text fontSize="xs" opacity={0.8} mb={3}>
        {siteStatus.enabled ? "Dark mode is active on this site." : "Dark mode is off on this site."}
      </Text>
      <Button size="sm" width="100%" onClick={() => onToggleSite(!siteStatus.enabled)}>
        {siteStatus.enabled ? "Disable on this site" : "Enable on this site"}
      </Button>
    </Box>
  );
}
