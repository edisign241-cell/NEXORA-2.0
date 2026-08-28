"use client";

import * as React from "react";
import { Modal } from "../ui/modal";
import { Select } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/use-user-store";
import { useCartStore } from "@/store/use-cart-store";
import { GABON_PROVINCES, ProvinceData } from "@/lib/constants/gabon-locations";
import { MapPin, Navigation, Phone, CheckCircle2, PlusCircle, Sparkles } from "lucide-react";

export function LocationModal() {
  const { isLocationModalOpen, setIsLocationModalOpen, selectedLocation, setLocation } =
    useUserStore();
  const setDeliveryLocation = useCartStore((state) => state.setDeliveryLocation);

  const [provinceId, setProvinceId] = React.useState("estuaire");
  const [villeName, setVilleName] = React.useState("Libreville");
  const [quartierName, setQuartierName] = React.useState("Nzeng-Ayong");
  const [isCustomDistrict, setIsCustomDistrict] = React.useState(false);
  const [customDistrictName, setCustomDistrictName] = React.useState("");
  const [repere, setRepere] = React.useState(
    "Face pharmacie de Nzeng-Ayong, grand portail vert à 50m du carrefour GP"
  );
  const [telephone, setTelephone] = React.useState("+241 077 45 89 12");
  const [isSaved, setIsSaved] = React.useState(false);

  // Sync state with selectedLocation when modal opens
  React.useEffect(() => {
    if (selectedLocation) {
      const prov = GABON_PROVINCES.find(
        (p: ProvinceData) => p.nom.toLowerCase() === selectedLocation.province.toLowerCase()
      );
      if (prov) setProvinceId(prov.id);
      setVilleName(selectedLocation.ville || "Libreville");
      
      const currentV = (prov || GABON_PROVINCES[0]).villes.find(
        (v) => v.nom === (selectedLocation.ville || "Libreville")
      );
      const isKnown = currentV?.quartiers.includes(selectedLocation.quartier);
      if (isKnown) {
        setQuartierName(selectedLocation.quartier);
        setIsCustomDistrict(false);
      } else if (selectedLocation.quartier) {
        setIsCustomDistrict(true);
        setCustomDistrictName(selectedLocation.quartier);
      }

      setRepere(selectedLocation.repere_texte || "");
      if (selectedLocation.telephone) setTelephone(selectedLocation.telephone);
    }
  }, [selectedLocation, isLocationModalOpen]);

  const currentProvince =
    GABON_PROVINCES.find((p: ProvinceData) => p.id === provinceId) || GABON_PROVINCES[0];

  const currentVille =
    currentProvince.villes.find((v) => v.nom === villeName) ||
    currentProvince.villes[0];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvId = e.target.value;
    setProvinceId(newProvId);
    const prov = GABON_PROVINCES.find((p: ProvinceData) => p.id === newProvId);
    if (prov && prov.villes.length > 0) {
      const firstVille = prov.villes[0];
      setVilleName(firstVille.nom);
      setQuartierName(firstVille.quartiers[0] || "Centre");
      setIsCustomDistrict(false);
    }
  };

  const handleVilleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVilleName = e.target.value;
    setVilleName(newVilleName);
    const v = currentProvince.villes.find((item) => item.nom === newVilleName);
    if (v && v.quartiers.length > 0) {
      setQuartierName(v.quartiers[0]);
      setIsCustomDistrict(false);
    }
  };

  const handleQuickDistrictSelect = (q: string) => {
    setQuartierName(q);
    setIsCustomDistrict(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuartier = isCustomDistrict
      ? customDistrictName.trim() || "Quartier non précisé"
      : quartierName;

    const newLoc = {
      province: currentProvince.nom,
      ville: villeName,
      quartier: finalQuartier,
      repere_texte: repere.trim(),
      telephone: telephone.trim(),
    };
    setLocation(newLoc);
    setDeliveryLocation(newLoc);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsLocationModalOpen(false);
    }, 600);
  };

  return (
    <Modal
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
      title={
        <div className="flex items-center gap-2 text-[#111827]">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#065f46]">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="font-black italic">Définir votre zone de livraison au Gabon</span>
        </div>
      }
      description="Précisez votre province, ville, quartier et repère visuel pour une livraison express à votre porte par nos coursiers."
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-4 mt-2">
        {/* Province & Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Province (Gabon)"
            value={provinceId}
            onChange={handleProvinceChange}
          >
            {GABON_PROVINCES.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.code} - {prov.nom} ({prov.chefLieu})
              </option>
            ))}
          </Select>

          <Select
            label="Ville / Commune"
            value={villeName}
            onChange={handleVilleChange}
          >
            {currentProvince.villes.map((ville) => (
              <option key={ville.nom} value={ville.nom}>
                {ville.nom} {ville.isChefLieu ? "★" : ""}
              </option>
            ))}
          </Select>
        </div>

        {/* Quartiers Pilotes Rapides */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Quartiers fréquents à {villeName}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {currentVille?.quartiers.slice(0, 6).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickDistrictSelect(q)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all font-medium ${
                  !isCustomDistrict && quartierName === q
                    ? "bg-[#065f46] text-white border-[#065f46] font-semibold shadow-sm"
                    : "bg-[#f9fafb] text-[#111827] border-slate-200 hover:bg-emerald-50 hover:text-[#065f46]"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Quartier / Option "Mon quartier n'apparaît pas" */}
        <div className="space-y-2">
          {!isCustomDistrict ? (
            <div>
              <Select
                label="Quartier / Secteur répertorié"
                value={quartierName}
                onChange={(e) => setQuartierName(e.target.value)}
              >
                {currentVille?.quartiers.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </Select>
              <div className="mt-1.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomDistrict(true);
                    setCustomDistrictName("");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Mon quartier n&apos;apparaît pas dans la liste
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-50/40 p-3 dark:border-emerald-800/40 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Saisie d&apos;un quartier personnalisé
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomDistrict(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 underline dark:text-slate-400"
                >
                  Revenir à la liste
                </button>
              </div>
              <Input
                label="Nom de votre quartier ou secteur"
                type="text"
                required
                value={customDistrictName}
                onChange={(e) => setCustomDistrictName(e.target.value)}
                placeholder="Ex : Derrière la prison, Camp de Police, PK 12..."
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Repère Visuel (Essential in Gabon) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Point de repère précis (Obligatoire au Gabon) <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <textarea
              required
              rows={3}
              value={repere}
              onChange={(e) => setRepere(e.target.value)}
              placeholder="Ex : Barrière blanche en face de la pharmacie, grand manguier à 50m après le carrefour GP..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            💡 Au Gabon, un repère clair permet au livreur de vous localiser en moins de 15 minutes sans errer.
          </p>
        </div>

        {/* Numéro de téléphone pour la livraison */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Numéro de téléphone joignable (Airtel / Moov)
          </label>
          <Input
            type="tel"
            required
            icon={<Phone className="w-4 h-4" />}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="+241 077 00 00 00"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLocationModalOpen(false)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="emerald"
            className="gap-2 font-semibold shadow-sm"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>Adresse Enregistrée !</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Valider cette localisation</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
