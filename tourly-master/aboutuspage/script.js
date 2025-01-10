document.getElementById('copy-code').addEventListener('click', () => {
    const code = `<!DOCTYPE html>
<html lang="en">
... (Rest of the HTML code here)
</html>`;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
});
