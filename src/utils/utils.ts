// export function scrollToBottom(name_selector_class: string) {
//     const container = document.querySelector(name_selector_class)
//     if (container) {
//         container.scrollTop = container.scrollHeight
//     }
// }

export async function downloadFile(file_name: string, file_data: string) {
    const mime_type = 'text/plain';
    const file_extension = 'rdf';
    const blob = new Blob([file_data], { type: mime_type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file_name + '.' + file_extension
    // эмулируем клик и очищаем память
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url)
}
