package com.daemon.seeker;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Handle deep links for wallet apps
                if (url.startsWith("phantom://") || url.startsWith("solflare://") || 
                    url.startsWith("backpack://") || url.startsWith("trust://")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        // Fallback to Play Store
                        String packageName = getPackageNameFromUrl(url);
                        if (packageName != null) {
                            Intent intent = new Intent(Intent.ACTION_VIEW, 
                                Uri.parse("market://details?id=" + packageName));
                            startActivity(intent);
                        }
                        return true;
                    }
                }
                return false;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject JavaScript to help with debugging
                view.evaluateJavascript(
                    "console.log('Page loaded: ' + window.location.href);" +
                    "console.log('Document ready state: ' + document.readyState);" +
                    "console.log('Root element exists: ' + (document.getElementById('root') !== null));", 
                    null
                );
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                // Log errors for debugging
                System.out.println("WebView Error: " + errorCode + " - " + description + " - " + failingUrl);
            }
        });
        
        // Enable JavaScript and other settings
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        
        webView.loadUrl("file:///android_asset/public/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
    
    private String getPackageNameFromUrl(String url) {
        if (url.startsWith("phantom://")) {
            return "app.phantom";
        } else if (url.startsWith("solflare://")) {
            return "com.solflare.mobile";
        } else if (url.startsWith("backpack://")) {
            return "com.backpack.app";
        } else if (url.startsWith("trust://")) {
            return "com.wallet.crypto.trustapp";
        }
        return null;
    }
}
