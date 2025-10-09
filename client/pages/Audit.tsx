import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import Layout from "@/components/Layout";

export default function Audit() {
  const [contractAddress, setContractAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { resolvedTheme } = useTheme();

  const handleAnalyze = async () => {
    if (!contractAddress.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisResult({
        contractAddress,
        status: "analyzed",
        vulnerabilities: ["Reentrancy vulnerability detected", "Access control issues"],
        recommendations: ["Implement reentrancy guards", "Add proper access controls"]
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className={`min-h-screen p-6 ${
        resolvedTheme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className={`w-12 h-12 ${
                resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Smart Contract Pre-Audit
            </h1>
            <p className={`text-lg ${
              resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Analyze your smart contract for potential vulnerabilities
            </p>
          </div>

          {/* Input Form */}
          <Card className={`mb-8 ${
            resolvedTheme === 'dark' 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <FileText className="w-5 h-5" />
                Contract Information
              </CardTitle>
              <CardDescription className={
                resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }>
                Enter the smart contract address you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contract-address" className={
                  resolvedTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                }>
                  Contract Address
                </Label>
                <Input
                  id="contract-address"
                  type="text"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className={resolvedTheme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}
                />
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={!contractAddress.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Start Analysis"}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card className={`${
              resolvedTheme === 'dark' 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className={`text-sm font-medium ${
                    resolvedTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Contract Address:
                  </Label>
                  <p className={`font-mono text-sm mt-1 ${
                    resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {analysisResult.contractAddress}
                  </p>
                </div>

                <div>
                  <Label className={`text-sm font-medium flex items-center gap-2 ${
                    resolvedTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Vulnerabilities Found:
                  </Label>
                  <ul className={`mt-2 space-y-1 ${
                    resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {analysisResult.vulnerabilities.map((vuln: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {vuln}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className={`text-sm font-medium ${
                    resolvedTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Recommendations:
                  </Label>
                  <ul className={`mt-2 space-y-1 ${
                    resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
