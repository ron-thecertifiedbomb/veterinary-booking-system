import { Alert, Platform } from "react-native";

/**
 * Shows a cross-platform alert that functions like `window.alert`.
 * On native, it uses Alert.alert. On web, it uses window.alert.
 * After the user dismisses the alert, the optional `onOk` callback is executed.
 *
 * @param title The title of the alert.
 * @param message The message body of the alert.
 * @param onOk An optional callback to execute after the alert is dismissed.
 */
export const showAlert = (
    title: string,
    message: string,
    onOk?: () => void
) => {
    if (Platform.OS === "web") {
        // window.alert doesn't have a title, so we combine it with the message.
        alert(`${title}\n\n${message}`);
        onOk?.();
    } else {
        Alert.alert(title, message, onOk ? [{ text: "OK", onPress: onOk }] : undefined);
    }
};

/**
 * Shows a cross-platform confirmation dialog.
 * On native, it uses Alert.alert with "Cancel" and a custom confirmation button.
 * On web, it uses the browser's `window.confirm`.
 *
 * @param title The title of the dialog (native only).
 * @param message The message to display in the dialog.
 * @param onConfirm The function to call if the user confirms.
 * @param confirmText The text for the confirmation button (defaults to "OK").
 * @param isDestructive Marks the confirmation action as destructive (e.g., for deletion).
 */
export const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = "OK",
    isDestructive: boolean = false
) => {
    if (Platform.OS === "web") {
        if (window.confirm(message)) {
            onConfirm();
        }
    } else {
        Alert.alert(title, message, [
            { text: "Cancel", style: "cancel" },
            {
                text: confirmText,
                style: isDestructive ? "destructive" : "default",
                onPress: onConfirm,
            },
        ]);
    }
};
