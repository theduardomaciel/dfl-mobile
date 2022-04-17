import changeNavigationBarColor, {
    hideNavigationBar,
    showNavigationBar,
} from 'react-native-navigation-bar-color';

const defaultProps = {
    buttonStyle: true,
    visibility: false,
    backgroundColor: "#ffffff00"
}

export async function UpdateNavigationBar(buttonStyle: "dark" | "light", visibility: boolean, backgroundColor: string) {
    try {
        visibility ? await showNavigationBar() : await hideNavigationBar()
        await changeNavigationBarColor(
            backgroundColor ? backgroundColor : defaultProps.backgroundColor,
            buttonStyle ? buttonStyle === "dark" ? false : true : defaultProps.buttonStyle,
            true
        )
    } catch (error) {
        console.log("Provavelmente o pacote necessário para atualização da navigation bar não foi instalado corretamente.")
    }
}