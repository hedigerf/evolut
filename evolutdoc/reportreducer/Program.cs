using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ReadFile
{
    class Program
    {
        static void Main(string[] args)
        {
            string text = System.IO.File.ReadAllText(@"C:\Users\Fabian\Downloads\20160501160702_fitness_graph_average_report.txt");
            string path = @"C:\Users\Fabian\Downloads\20160501160702_Z_fitness_graph_average_report.txt";
            File.Create(path).Dispose();
            char[] chars = new char[text.Length];
            using (StringReader sr = new StringReader(text))
            {
                // Read 13 characters from the string into the array.
                sr.Read(chars, 0, text.Length);
                StringBuilder sb = new StringBuilder();
                List<decimal> fitnessVals = new List<decimal>();
                int counter = 0;
                double generation = 0;
                foreach (char c in chars)
                {
                    if(c != '(')
                    {           
                        if(c == ',')
                        {
                            generation = Double.Parse(sb.ToString());
                            //Console.WriteLine(generation);
                            sb.Clear();
                        }
                        else if (c == '.')
                        {
                            sb.Append(',');
                        }
                        else if(c == ')')
                        {
                            decimal  fitness = System.Convert.ToDecimal(sb.ToString());
                            fitnessVals.Add(fitness);
                            if(fitnessVals.Count == 3)
                            {
                                decimal sum = 0;
                                foreach(decimal d in fitnessVals)
                                {
                                    sum += d;
                                }
                                decimal newFitness = sum / 3;
                                counter++;
                                string replaced = (newFitness + "").Replace(',', '.');
                                string entry = "(" + generation + ", " + replaced + ")";
                                Console.WriteLine(entry);
                                using (StreamWriter sw = File.AppendText(path))
                                {
                                    sw.Write(entry);
                                }
                                fitnessVals.Clear();
                            }
                            sb.Clear();
                        }
                        else
                        {
                            sb.Append(c);
                        }
                    }
                }
                Console.WriteLine("Sleep for 2 seconds.");
                Thread.Sleep(2000);
            }
        }
    }
}
