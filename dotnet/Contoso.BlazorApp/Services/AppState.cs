namespace Contoso.BlazorApp.Services;

public class AppState
{
    private string _username = string.Empty;
    private bool _apiAvailable = true;

    public string Username
    {
        get => _username;
        set { _username = value; NotifyStateChanged(); }
    }

    public bool ApiAvailable
    {
        get => _apiAvailable;
        set { _apiAvailable = value; NotifyStateChanged(); }
    }

    public event Action? OnChange;

    private void NotifyStateChanged() => OnChange?.Invoke();
}
