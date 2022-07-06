export default function GetRatingsAverage(actualReport) {
    //console.log("Atualizando rating do relatório atual.")
    const note1Medium = actualReport.note1 * 1
    const note2Medium = actualReport.note2 * 2
    const note3Medium = actualReport.note3 * 3
    const note4Medium = actualReport.note4 * 4
    const note5Medium = actualReport.note5 * 5

    const somaDasNotasComOsPesos = note1Medium + note2Medium + note3Medium + note4Medium + note5Medium
    const mediaPonderada = (somaDasNotasComOsPesos) / (actualReport.note1 + actualReport.note2 + actualReport.note3 + actualReport.note4 + actualReport.note5)
    const string = mediaPonderada.toString().split(".")
    if (mediaPonderada.toString() !== "NaN") {
        if (string.length > 1) {
            return `${string[0]}.${string[1].substring(0, 2)}`
        } else {
            return `${mediaPonderada}.0`
        }
    } else {
        return `0`
    }
}