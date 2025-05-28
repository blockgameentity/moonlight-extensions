using System.Diagnostics;
using System.IO.Compression;
using System.Reflection;

var procs = Process.GetProcessesByName("Discord");

var dirList = new List<string?>();
string? lastDir = null;

foreach (var proc in procs)
{
    if (proc.MainModule != null)
    {
        lastDir = proc.MainModule.FileName;
        Console.WriteLine(lastDir);
        dirList.Add(proc.MainModule.FileName);
    }
}

if (dirList.All(dir => dir == lastDir))
{
    foreach (var proc in procs)
    {
        proc.CloseMainWindow();
    }
}

var appPath = Path.GetDirectoryName(lastDir);
if (appPath != null)
{
    var voicePath = Path.Combine(appPath, "modules", "discord_voice-1", "discord_voice");

    if (Directory.Exists(voicePath))
    {
        var zip = GetBytes("exec.discord_voice.zip");
        var zipOut = Path.Combine(voicePath, "a.zip");
    
        if (File.Exists(zipOut))
            File.Delete(zipOut);
    
        File.WriteAllBytes(zipOut, zip);
        foreach (var proc in Process.GetProcessesByName("Discord"))
        {
            proc.CloseMainWindow();
        }
        ZipFile.ExtractToDirectory(zipOut, voicePath, true);
        File.Delete(zipOut);
        Thread.Sleep(2000);
        Process.Start(Path.Combine(appPath, "Discord.exe"));
    }
}

return;

byte[] GetBytes(string resourceName)
{
    var a = Assembly.GetExecutingAssembly();
    using var resFilestream = a.GetManifestResourceStream(resourceName);
    if (resFilestream == null) return null;
    var ba = new byte[resFilestream.Length];
    resFilestream.ReadExactly(ba, 0, ba.Length);
    return ba;
}