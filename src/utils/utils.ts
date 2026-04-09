export async function downloadFile(file_name: string, file_data: string, format: string) {
    const mime_type = 'text/plain';
    const file_extension = format;
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
