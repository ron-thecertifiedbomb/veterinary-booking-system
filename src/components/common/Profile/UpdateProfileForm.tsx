import { BackButton } from "@/components/common/BackButton/BackButton";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import MobileScreen from "@/components/layout/MobileScreen";
import AppButton from "@/components/ui/AppButton";
import FormFields from "@/components/ui/FormFields";
import FormSection from "@/components/ui/FormSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import { useUpdateProfile } from "@/features/users/hook/UpdateProfile";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { useMobileInsets } from "@/hooks/useMobileInsets";
import { getProfileRoutes, Role } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { z } from "zod";

const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
});

type FormData = z.infer<typeof editProfileSchema>;
type Errors = Partial<Record<keyof FormData, string | null>>;

export default function EditProfileForm() {
  const router = useRouter();
  const { refreshSession, user } = useAuth();
  const { updateProfile, loading } = useUpdateProfile();
  const { profile, fetchUserProfile, loading: fetching } = useGetUserProfile();
  const profileRoutes = getProfileRoutes(user?.role as Role | undefined);
  const { isCompact, isNarrow, isNative } = useIsCompactScreen();
  const { screenPadding } = useMobileInsets(false);

  const [form, setForm] = useState<FormData>({ name: "", phone: "" });
  const [original, setOriginal] = useState<FormData>({ name: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;
    const data = { name: profile.name || "", phone: profile.phone || "" };
    setForm(data);
    setOriginal(data);
  }, [profile]);

  const updateField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const hasChanges = form.name !== original.name || form.phone !== original.phone;

  const handleSubmit = async () => {
    const result = editProfileSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] ?? null,
        phone: fieldErrors.phone?.[0] ?? null,
      });
      return;
    }

    const res = await updateProfile(result.data);
    if (!res) {
      showAlert("Error", "Failed to update profile");
      return;
    }

    await refreshSession();

    showAlert("Success", res.message, () => {
      router.replace(profileRoutes.profile);
    });
  };

  if (fetching && !profile) return <Loader fullScreen />;

  const formPanel = (
    <>
      {isCompact ? (
        <HeaderSection
          title="Edit profile"
          description="Update your personal contact information."
        />
      ) : null}

      <Panel
        wide={!isCompact}
        title={isCompact ? undefined : "Edit profile"}
        lead={isCompact ? undefined : "Update your personal contact information."}
      >
        <View className="mb-5">
          <SectionLabel>Email</SectionLabel>
          <Text className="text-body text-text-primary mt-1 font-sans">{profile?.email || "—"}</Text>
          <Text className="text-xs text-text-muted mt-1 font-sans">Email cannot be changed here.</Text>
        </View>

        <FormFields>
          <FormSection title="Contact">
            <AppTextInput
              label="Full name"
              value={form.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Juan Dela Cruz"
              error={errors.name}
            />
            <AppTextInput
              label="Phone"
              value={form.phone}
              onChangeText={(text) => updateField("phone", text.replace(/\D/g, ""))}
              placeholder="09123456789"
              error={errors.phone}
            />
          </FormSection>
        </FormFields>

        <View className={`mt-8 ${isNarrow ? "gap-3" : "flex-row gap-3"}`}>
          {isNarrow ? (
            <>
              <AppButton
                label="Save changes"
                onPress={handleSubmit}
                loading={loading}
                disabled={!form.name || !form.phone || !hasChanges}
              />
              <AppButton
                label="Cancel"
                variant="secondary"
                onPress={() => router.replace(profileRoutes.profile)}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <View className="flex-1">
                <AppButton
                  label="Cancel"
                  variant="secondary"
                  onPress={() => router.replace(profileRoutes.profile)}
                  disabled={loading}
                />
              </View>
              <View className="flex-1">
                <AppButton
                  label="Save changes"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={!form.name || !form.phone || !hasChanges}
                />
              </View>
            </>
          )}
        </View>
      </Panel>
    </>
  );

  const content = (
    <Container className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={isCompact ? screenPadding : { paddingBottom: 32 }}
      >
        <View className={isCompact ? "mb-2" : "mb-4"}>
          <BackButton webRoute={profileRoutes.profile} appRoute={profileRoutes.profile} />
        </View>
        {formPanel}
      </ScrollView>
    </Container>
  );

  if (isCompact && isNative) {
    return <MobileScreen scroll={false}>{content}</MobileScreen>;
  }

  return content;
}
